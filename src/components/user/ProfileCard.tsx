// src/components/user/ProfileCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
    initials:              string;
    name:                  string;
    email:                 string;
    role:                  string;
    avatarUrl?:            string | null;
    phoneNumber?:          string | null;
    birthYear?:            number | null;
    address?:              string | null;
    gender?:               'MALE' | 'FEMALE' | 'OTHER' | null;
    // Gamification
    level?:                number;
    xp?:                   number;
    progressPercentage?:   number;
    xpNeededForNextLevel?: number;
    streakCount?:          number;
    longestStreak?:        number;
    totalQuizCompleted?:   number;
    totalFlashcardLearned?: number;
}

interface Props {
    user:             User | null;
    onEdit:           () => void;
    onChangePassword: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const genderLabel = (g?: string | null) => {
    if (g === 'MALE')   return 'Nam';
    if (g === 'FEMALE') return 'Nữ';
    if (g === 'OTHER')  return 'Khác';
    return null;
};

// ── Sub-components ────────────────────────────────────────────────────────────
interface InfoRowProps {
    icon:         React.ComponentProps<typeof Ionicons>['name'];
    label:        string;
    value?:       string | null;
    showDivider?: boolean;
}

function InfoRow({ icon, label, value, showDivider = false }: InfoRowProps) {
    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
                <View style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: '#F9FAFB',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ionicons name={icon} size={15} color="#9CA3AF" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '600',
                        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>
                        {label}
                    </Text>
                    <Text style={{ fontSize: 14, color: value ? '#1a1a1a' : '#D1D5DB', fontWeight: value ? '500' : '400' }}
                          numberOfLines={1}>
                        {value || 'Chưa thiết lập'}
                    </Text>
                </View>
            </View>
            {showDivider && <View style={{ height: 1, backgroundColor: '#F3F4F6', marginLeft: 44 }} />}
        </>
    );
}

interface StatCardProps {
    iconName:  React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    iconBg:    string;
    label:     string;
    value:     string | number;
    valueColor: string;
}

function StatCard({ iconName, iconColor, iconBg, label, value, valueColor }: StatCardProps) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FAFAF8',
            borderWidth: 1, borderColor: '#EBEBEB',
            borderRadius: 14, padding: 14,
        }}>
            <View style={{
                width: 30, height: 30, borderRadius: 8,
                backgroundColor: iconBg,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 8,
            }}>
                <Ionicons name={iconName} size={14} color={iconColor} />
            </View>
            <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                {label}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: valueColor }}>
                {value}
            </Text>
        </View>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProfileCardSkeleton() {
    const Bone = ({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) => (
        <View style={{ width: w as any, height: h, borderRadius: r, backgroundColor: '#F3F4F6' }} />
    );
    return (
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6' }} />
                <View style={{ gap: 8 }}>
                    <Bone w={120} h={14} r={6} />
                    <Bone w={80}  h={10} r={6} />
                </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />
            <View style={{ padding: 20, gap: 4 }}>
                {[0,1,2,3].map(i => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#F3F4F6' }} />
                        <View style={{ gap: 6 }}>
                            <Bone w={60}  h={8}  r={4} />
                            <Bone w={140} h={11} r={4} />
                        </View>
                    </View>
                ))}
            </View>
            <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />
            <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
                <View style={{ flex: 1, height: 46, borderRadius: 12, backgroundColor: '#F3F4F6' }} />
                <View style={{ flex: 1, height: 46, borderRadius: 12, backgroundColor: '#F3F4F6' }} />
            </View>
        </View>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfileCard({ user, onEdit, onChangePassword }: Props) {
    if (!user) return <ProfileCardSkeleton />;

    const xpProgress = user.progressPercentage ?? 0;

    return (
        <View style={{ marginBottom: 24 }}>

            {/* ── Top card: Avatar + XP ── */}
            <View style={{
                backgroundColor: '#fff',
                borderWidth: 1, borderColor: '#EBEBEB',
                borderRadius: 20, padding: 20,
                marginBottom: 10,
            }}>
                {/* Avatar row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <View style={{
                        width: 72, height: 72, borderRadius: 36,
                        backgroundColor: '#F3F4F0',
                        borderWidth: 1, borderColor: '#E8E8E4',
                        overflow: 'hidden',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        {user.avatarUrl
                            ? <Image source={{ uri: user.avatarUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            : <Text style={{ fontSize: 22, fontWeight: '600', color: '#777', letterSpacing: 1 }}>{user.initials}</Text>
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 }} numberOfLines={1}>
                            {user.name || 'Học viên TREEdu'}
                        </Text>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', gap: 4,
                            alignSelf: 'flex-start',
                            backgroundColor: '#EAF4EE', borderRadius: 20,
                            paddingHorizontal: 10, paddingVertical: 4,
                        }}>
                            <Ionicons name="shield-checkmark-outline" size={11} color="#2D6A4F" />
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#2D6A4F' }}>{user.role}</Text>
                        </View>
                    </View>
                </View>

                {/* XP bar */}
                <View style={{ borderTopWidth: 1, borderTopColor: '#F0F0EE', paddingTop: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="trophy-outline" size={13} color="#B98C2A" />
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#555' }}>
                                Cấp {user.level ?? 1}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#AAA', fontWeight: '600' }}>
                            {user.xp ?? 0} XP
                        </Text>
                    </View>
                    <View style={{ height: 6, backgroundColor: '#EBEBEB', borderRadius: 3, overflow: 'hidden' }}>
                        <View style={{
                            height: '100%', backgroundColor: '#3D7A5C',
                            borderRadius: 3, width: `${xpProgress}%`,
                        }} />
                    </View>
                    <Text style={{ fontSize: 11, color: '#BBB', fontWeight: '600', textAlign: 'right', marginTop: 4 }}>
                        {user.xpNeededForNextLevel ?? 0} XP để lên cấp
                    </Text>
                </View>
            </View>

            {/* ── Stat grid ── */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                <StatCard iconName="flame-outline"     iconColor="#E8773A" iconBg="#FFF3EC"
                          label="Streak"   value={`${user.streakCount ?? 0} ngày`}    valueColor="#E8773A" />
                <StatCard iconName="flash-outline"     iconColor="#C9960D" iconBg="#FEF9EC"
                          label="Kỷ lục"  value={`${user.longestStreak ?? 0} ngày`}  valueColor="#C9960D" />
                <StatCard iconName="checkmark-circle-outline" iconColor="#2D6A4F" iconBg="#EAF4EE"
                          label="Quiz"    value={user.totalQuizCompleted ?? 0}        valueColor="#2D6A4F" />
                <StatCard iconName="book-outline"      iconColor="#2453A8" iconBg="#EAF1FB"
                          label="Flashcard" value={user.totalFlashcardLearned ?? 0}  valueColor="#2453A8" />
            </View>

            {/* ── Detail card ── */}
            <View style={{
                backgroundColor: '#fff',
                borderWidth: 1, borderColor: '#EBEBEB',
                borderRadius: 20, overflow: 'hidden',
            }}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 16,
                    borderBottomWidth: 1, borderBottomColor: '#F0F0EE',
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>Thông tin tài khoản</Text>

                </View>

                <View style={{ paddingHorizontal: 20, paddingVertical: 4 }}>
                    <InfoRow icon="mail-outline"     label="Email"           value={user.email}                showDivider />
                    <InfoRow icon="person-outline"   label="Họ và tên"       value={user.name}                 showDivider />
                    <InfoRow icon="call-outline"     label="Số điện thoại"   value={user.phoneNumber}          showDivider />
                    <InfoRow icon="calendar-outline" label="Năm sinh"        value={user.birthYear ? String(user.birthYear) : null} showDivider />
                    <InfoRow icon="male-female-outline" label="Giới tính"   value={genderLabel(user.gender)}  showDivider />
                    <InfoRow icon="location-outline" label="Địa chỉ"        value={user.address} />
                </View>

                <View style={{ height: 1, backgroundColor: '#F0F0EE' }} />

                {/* Action buttons */}
                <View style={{ flexDirection: 'row', gap: 10, padding: 16 }}>
                    <TouchableOpacity
                        onPress={onEdit}
                        style={{
                            flex: 1, height: 46,
                            backgroundColor: '#1C1C1C',
                            borderRadius: 12,
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="pencil-outline" size={14} color="#fff" />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Chỉnh sửa hồ sơ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onChangePassword}
                        style={{
                            flex: 1, height: 46,
                            backgroundColor: '#fff',
                            borderWidth: 1.5, borderColor: '#E5E7EB',
                            borderRadius: 12,
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="lock-closed-outline" size={14} color="#111" />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#111' }}>Đổi mật khẩu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
