// src/components/ui/BottomSheetFilter.tsx
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    StyleSheet,
    Dimensions,
    Platform,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.45;

// ── Design tokens (mirrors quiz.tsx) ─────────────────────────────────────────
const C = {
    bg:         '#F8FAF5',
    surface:    '#FFFFFF',
    brand:      '#5A8A2E',
    brandDark:  '#3B6D11',
    brandLight: '#EAF3DE',
    text:       '#111111',
    muted:      '#9CA3AF',
    mutedDark:  '#6B7280',
    border:     '#EDEEED',
    overlay:    'rgba(0,0,0,0.40)',
} as const;

export interface FilterOption {
    value: string;
    label: string;
    /** Optional: disable this option (e.g. no quizzes at this level) */
    disabled?: boolean;
}

interface Props {
    visible:     boolean;
    title:       string;
    options:     FilterOption[];
    selected:    string;
    onSelect:    (value: string) => void;
    onClose:     () => void;
    /** Accent color for the selected check + active bg */
    accentColor?: string;
}

export default function BottomSheetFilter({
                                              visible,
                                              title,
                                              options,
                                              selected,
                                              onSelect,
                                              onClose,
                                              accentColor = C.brand,
                                          }: Props) {
    const translateY = useRef(new Animated.Value(SHEET_H)).current;
    const overlayOp  = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue:         0,
                    damping:         22,
                    stiffness:       260,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOp, {
                    toValue:         1,
                    duration:        220,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue:         SHEET_H,
                    duration:        240,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOp, {
                    toValue:         0,
                    duration:        200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleSelect = async (value: string, disabled?: boolean) => {
        if (disabled) return;
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (_) { /* Haptics not available on all devices */ }
        onSelect(value);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            {/* ── Overlay ── */}
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                <Animated.View style={[styles.overlay, { opacity: overlayOp }]} />
            </Pressable>

            {/* ── Sheet ── */}
            <Animated.View
                style={[styles.sheet, { transform: [{ translateY }] }]}
                pointerEvents="box-none"
            >
                {/* Drag handle */}
                <View style={styles.handle} />

                {/* Title row */}
                <View style={styles.titleRow}>
                    <Text style={styles.sheetTitle}>{title}</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                        <Ionicons name="close" size={18} color={C.mutedDark} />
                    </TouchableOpacity>
                </View>

                {/* Options */}
                <View style={styles.optionList}>
                    {options.map((opt, i) => {
                        const isSelected = selected === opt.value;
                        const isLast     = i === options.length - 1;
                        return (
                            <React.Fragment key={opt.value}>
                                <TouchableOpacity
                                    style={[
                                        styles.optionRow,
                                        isSelected && { backgroundColor: accentColor + '12' },
                                        opt.disabled && styles.optionDisabled,
                                    ]}
                                    activeOpacity={opt.disabled ? 1 : 0.65}
                                    onPress={() => handleSelect(opt.value, opt.disabled)}
                                >
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            isSelected  && { color: accentColor, fontWeight: '700' },
                                            opt.disabled && styles.optionLabelDisabled,
                                        ]}
                                    >
                                        {opt.label}
                                    </Text>

                                    {opt.disabled && (
                                        <Text style={styles.optionEmptyTag}>Không có bài</Text>
                                    )}

                                    {isSelected && !opt.disabled && (
                                        <View style={[styles.checkCircle, { backgroundColor: accentColor }]}>
                                            <Ionicons name="checkmark" size={13} color="#FFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>

                                {!isLast && <View style={styles.optionDivider} />}
                            </React.Fragment>
                        );
                    })}
                </View>
            </Animated.View>
        </Modal>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: C.overlay,
    },
    sheet: {
        position:        'absolute',
        bottom:          0,
        left:            0,
        right:           0,
        height:          SHEET_H,
        backgroundColor: C.surface,
        borderTopLeftRadius:  28,
        borderTopRightRadius: 28,
        paddingHorizontal:    20,
        paddingBottom:        Platform.OS === 'ios' ? 34 : 20,
        ...Platform.select({
            ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 20 },
            android: { elevation: 20 },
        }),
    },
    handle: {
        width:           40,
        height:          4,
        borderRadius:    2,
        backgroundColor: '#D1D5DB',
        alignSelf:       'center',
        marginTop:       12,
        marginBottom:    4,
    },
    titleRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    sheetTitle: {
        fontSize:   17,
        fontWeight: '800',
        color:      C.text,
    },
    closeBtn: {
        width:           32,
        height:          32,
        borderRadius:    16,
        backgroundColor: '#F3F4F6',
        alignItems:      'center',
        justifyContent:  'center',
    },
    optionList: {
        backgroundColor: C.bg,
        borderRadius:    18,
        overflow:        'hidden',
    },
    optionRow: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingVertical:   16,
        paddingHorizontal: 18,
        minHeight:         56,
    },
    optionLabel: {
        flex:       1,
        fontSize:   15,
        fontWeight: '500',
        color:      C.text,
    },
    optionLabelDisabled: {
        color:   C.muted,
        opacity: 0.55,
    },
    optionDisabled: { opacity: 0.7 },
    optionEmptyTag: {
        fontSize:          10,
        fontWeight:        '600',
        color:             C.muted,
        backgroundColor:   '#F3F4F6',
        borderRadius:      10,
        paddingHorizontal: 8,
        paddingVertical:   3,
        marginRight:       4,
    },
    checkCircle: {
        width:          24,
        height:         24,
        borderRadius:   12,
        alignItems:     'center',
        justifyContent: 'center',
    },
    optionDivider: {
        height:          1,
        backgroundColor: C.border,
        marginHorizontal: 18,
    },
});
