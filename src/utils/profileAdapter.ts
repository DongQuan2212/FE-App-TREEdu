// src/utils/profileAdapter.ts
//
// Adapter: chuyển CurrentUser (từ BE) → User (profile.types) cho ProfileCard.
//
// BE trả về:
//   { id, email, name, role: "ROLE_MEMBER", status }
//
// ProfileCard cần:
//   { name, email, role (label), initials }
// ─────────────────────────────────────────────────────────────────────────────
import type { CurrentUser } from '../types/auth';
import type { User }        from '../types/profile.types';

// ── Label role thân thiện ────────────────────────────────────────────────────
const ROLE_LABEL: Record<string, string> = {
    ROLE_ADMIN:     'Quản trị viên',
    ROLE_MEMBER:    'Thành viên',
    ROLE_SUPPORTER: 'Hỗ trợ viên',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Kiểm tra name có phải tên thật không.
 * "123", "" hay giá trị toàn số → chưa đặt tên → dùng email làm fallback.
 */
const isRealName = (name?: string | null): boolean => {
    if (!name?.trim()) return false;
    if (/^\d+$/.test(name.trim())) return false;
    if (name.includes('@')) return false;
    return true;
};

/** Tên hiển thị: tên thật hoặc phần trước @ của email */
const resolveDisplayName = (name: string, email: string): string => {
    if (isRealName(name)) return name.trim();
    return email.split('@')[0];
};

/**
 * Avatar initials:
 *   - Tên thật 2+ từ → chữ đầu họ + chữ đầu tên cuối  ("Nguyễn Văn A" → "NA")
 *   - Tên thật 1 từ  → chữ đầu tiên                    ("Quân" → "Q")
 *   - Fallback email → 2 ký tự đầu                      ("builedong..." → "BU")
 */
const resolveInitials = (name: string, email: string): string => {
    if (isRealName(name)) {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
};

// ── Adapter function ──────────────────────────────────────────────────────────
export const mapCurrentUserToProfile = (user: CurrentUser): User => ({
    name:     resolveDisplayName(user.name, user.email),
    email:    user.email,
    role:     ROLE_LABEL[user.role] ?? user.role,   // "ROLE_MEMBER" → "Thành viên"
    initials: resolveInitials(user.name, user.email),
});
