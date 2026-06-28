// src/components/NotificationDetailModal.tsx
import React from 'react';
import {
    Modal, View, Text, TouchableOpacity,
    StyleSheet, TouchableWithoutFeedback, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationDetailModalProps {
    visible: boolean;
    notification: any;
    onClose: () => void;
}

const formatNotificationTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${date.toLocaleDateString('vi-VN')}`;
};

export default function NotificationDetailModal({ visible, notification, onClose }: NotificationDetailModalProps) {
    if (!notification) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeText}>
                                    {notification.type || 'HỆ THỐNG'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Body */}
                        <View style={styles.body}>
                            <Text style={styles.title}>{notification.title}</Text>

                            <ScrollView style={styles.contentBox}>
                                <Text style={styles.content}>{notification.content}</Text>
                            </ScrollView>

                            <Text style={styles.timeText}>
                                Thời gian: {formatNotificationTime(notification.createdAt)}
                            </Text>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
                                <Text style={styles.actionBtnText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    typeBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    typeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#065F46',
        textTransform: 'uppercase',
    },
    closeBtn: {
        padding: 4,
    },
    body: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        lineHeight: 24,
    },
    contentBox: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        maxHeight: 250,
    },
    content: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    timeText: {
        marginTop: 16,
        textAlign: 'right',
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        alignItems: 'flex-end',
    },
    actionBtn: {
        backgroundColor: '#059669',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
