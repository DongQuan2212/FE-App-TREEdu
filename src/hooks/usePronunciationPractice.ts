// src/hooks/usePronunciationPractice.ts
//
// Hook cho màn hình luyện phát âm theo topic.
// Xử lý: load câu ngẫu nhiên, ghi âm, gửi API chấm điểm.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { Audio }  from 'expo-av';
import { getRandomSentenceApi, checkPronunciationApi } from '../constants/pronunciationApi';
import type { PronunciationCheckResponse } from '../types/pronunciation.types';

export function usePronunciationPractice(topicName: string) {
    // ── Sentence ──────────────────────────────────────────────────────────────
    const [sentence,        setSentence]        = useState('');
    const [loadingSentence, setLoadingSentence] = useState(true);
    const [sentenceError,   setSentenceError]   = useState<string | null>(null);

    // ── Recording ─────────────────────────────────────────────────────────────
    const [recording,   setRecording]   = useState(false);
    const [processing,  setProcessing]  = useState(false);

    // ── Result ────────────────────────────────────────────────────────────────
    const [result,      setResult]      = useState<PronunciationCheckResponse | null>(null);
    const [resultError, setResultError] = useState<string | null>(null);

    // ── Expo AV refs ──────────────────────────────────────────────────────────
    const recordingRef = useRef<Audio.Recording | null>(null);

    // ── Load câu ngẫu nhiên ───────────────────────────────────────────────────
    const loadSentence = useCallback(async () => {
        setLoadingSentence(true);
        setSentenceError(null);
        setResult(null);
        setResultError(null);

        try {
            const s = await getRandomSentenceApi(topicName);
            setSentence(s);
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Không lấy được câu luyện phát âm.';
            setSentenceError(msg);
        } finally {
            setLoadingSentence(false);
        }
    }, [topicName]);

    useEffect(() => { loadSentence(); }, [loadSentence]);

    // ── Ghi âm: xin quyền + start ─────────────────────────────────────────────
    const startRecording = async () => {
        try {
            setResultError(null);
            setResult(null);

            // Xin quyền micro
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Cần quyền micro', 'Vui lòng cấp quyền micro để luyện phát âm.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: rec } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY,
            );

            recordingRef.current = rec;
            setRecording(true);

        } catch (err) {
            console.error('Start recording error:', err);
            Alert.alert('Lỗi', 'Không thể truy cập micro. Vui lòng thử lại.');
        }
    };

    // ── Dừng ghi âm + gửi API ────────────────────────────────────────────────
    const stopRecording = async () => {
        if (!recordingRef.current || !recording) return;

        setRecording(false);
        setProcessing(true);

        try {
            await recordingRef.current.stopAndUnloadAsync();

            const uri = recordingRef.current.getURI();
            recordingRef.current = null;

            if (!uri) throw new Error('No audio URI');

            // Đọc file audio thành blob
            const response  = await fetch(uri);
            const audioBlob = await response.blob();

            // Gửi lên BE chấm phát âm
            const res = await checkPronunciationApi(audioBlob, sentence);
            setResult(res);

        } catch (err: any) {
            const isTimeout = err?.code === 'ECONNABORTED';
            setResultError(
                isTimeout
                    ? 'Phân tích mất quá nhiều thời gian, vui lòng thử lại.'
                    : err?.response?.data?.message ?? 'Không thể chấm phát âm. Vui lòng thử lại.',
            );
        } finally {
            setProcessing(false);
            // Reset audio mode
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        }
    };

    const toggleRecording = () => {
        if (recording) stopRecording();
        else startRecording();
    };

    return {
        // Sentence
        sentence, loadingSentence, sentenceError,
        loadSentence,   // gọi để lấy câu mới

        // Recording
        recording, processing,
        toggleRecording,

        // Result
        result, resultError,
    };
}
