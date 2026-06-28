import React from 'react';
import {
    Modal, View, Text, TouchableOpacity,
    StyleSheet, ScrollView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationDropdownProps {
    visible: boolean;
    onClose: () => void;
    notifications: any[];
    unreadCount: number;
    onMarkAllRead: () => void;
    onNotificationClick: (notif: any) => void; // <--- Thêm dòng này
}

export default function NotificationDropdown({
                                                 visible, onClose, notifications, unreadCount, onMarkAllRead, onNotificationClick
                                             }: NotificationDropdownProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Lớp mờ nền tảng: Bấm vào khoảng không sẽ đóng Modal */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* Khung Dropdown thông báo */}
                <View style={styles.dropdownContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Thông báo</Text>
                        {unreadCount > 0 && (
                            <TouchableOpacity onPress={onMarkAllRead}>
                                <Text style={styles.markReadText}>Đánh dấu đã đọc</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Danh sách thông báo */}
                    <ScrollView
                        style={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {notifications.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="notifications-off-outline" size={32} color="#9CA3AF" />
                                <Text style={styles.emptyText}>Bạn không có thông báo nào</Text>
                            </View>
                        ) : (
                            notifications.map((notif, index) => (
                                <TouchableOpacity
                                    key={notif._id || index}
                                    style={[styles.notifItem, !notif.isRead && styles.notifItemUnread]}
                                    activeOpacity={0.7}
                                    onPress={() => onNotificationClick(notif)} // <--- Gọi hàm ở đây
                                >
                                    <View style={styles.notifIconWrap}>
                                        <Ionicons
                                            name="flash" // Tùy type mà đổi icon
                                            size={18}
                                            color="#059669"
                                        />
                                    </View>
                                    <View style={styles.notifContent}>
                                        <Text style={styles.notifTitle} numberOfLines={1}>
                                            {notif.title}
                                        </Text>
                                        <Text style={styles.notifDesc} numberOfLines={2}>
                                            {notif.content}
                                        </Text>
                                        <Text style={styles.notifTime}>
                                            {/* Dùng hàm format time của bạn ở đây */}
                                            Vài giây trước
                                        </Text>
                                    </View>
                                    {!notif.isRead && <View style={styles.unreadDot} />}
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <TouchableOpacity style={styles.footer} activeOpacity={0.7}>
                        <Text style={styles.footerText}>Xem tất cả thông báo</Text>
                    </TouchableOpacity>

                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        // Không làm nền quá tối để giữ cảm giác dropdown nhẹ nhàng
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    dropdownContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 70, // Canh chỉnh chiều dọc sao cho nằm dưới nút chuông
        right: 16,                             // Căn sát lề phải
        width: 320,                            // Chiều rộng cố định cho dropdown
        maxHeight: 400,                        // Chiều cao tối đa để list cuộn được
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        // Đổ bóng cho đẹp
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    markReadText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },
    listContainer: {
        flexShrink: 1, // Quan trọng để list cuộn được nếu vượt quá maxHeight
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 8,
        fontSize: 13,
        color: '#6B7280',
    },
    notifItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
        alignItems: 'flex-start',
    },
    notifItemUnread: {
        backgroundColor: '#ECFDF5', // Nền xanh nhạt nếu chưa đọc
    },
    notifIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    notifContent: {
        flex: 1,
    },
    notifTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    notifDesc: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
        marginBottom: 6,
    },
    notifTime: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginLeft: 8,
        marginTop: 4,
    },
    footer: {
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#F9FAFB',
    },
    footerText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#059669',
    },
});
