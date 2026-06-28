// src/utils/profileAdapter.ts
import { User } from '../components/user/ProfileCard';
import { ProfileData } from '../hooks/useProfile';

const formatRole = (role?: string): string => {
    switch (role) {
        case 'ROLE_ADMIN':     return 'Quản trị viên';
        case 'ROLE_SUPPORTER': return 'Hỗ trợ viên';
        default:               return 'Học viên';
    }
};

const getInitials = (name?: string | null): string => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(w => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

/** Map ProfileData (/users/me) + role (từ AuthContext) → User (ProfileCard) */
export function mapProfileToUser(profile: ProfileData, role?: string): User {
    return {
        initials:              getInitials(profile.fullName),
        name:                  profile.fullName              ?? 'Học viên TREEdu',
        email:                 profile.email                 ?? '',
        role:                  formatRole(role),
        avatarUrl:             profile.avatarUrl             ?? null,
        phoneNumber:           profile.phoneNumber           ?? null,
        birthYear:             profile.birthYear             ?? null,
        address:               profile.address               ?? null,
        gender:                profile.gender                ?? null,
        level:                 profile.level                 ?? 1,
        xp:                    profile.xp                    ?? 0,
        progressPercentage:    profile.progressPercentage    ?? 0,
        xpNeededForNextLevel:  profile.xpNeededForNextLevel  ?? 0,
        streakCount:           profile.streakCount           ?? 0,
        longestStreak:         profile.longestStreak         ?? 0,
        totalQuizCompleted:    profile.totalQuizCompleted    ?? 0,
        totalFlashcardLearned: profile.totalFlashcardLearned ?? 0,
    };
}
