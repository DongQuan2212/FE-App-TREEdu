import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CurrentUser } from '../types/auth';

const KEYS = {
    token: 'auth_token',
    user:  'auth_user',
};

// ── Token ────────────────────────────────────────────────
export const saveToken = (token: string) =>
    AsyncStorage.setItem(KEYS.token, token);

export const getToken = () =>
    AsyncStorage.getItem(KEYS.token);

export const removeToken = () =>
    AsyncStorage.removeItem(KEYS.token);

// ── User ─────────────────────────────────────────────────
export const saveUser = (user: CurrentUser) =>
    AsyncStorage.setItem(KEYS.user, JSON.stringify(user));

export const getUser = async (): Promise<CurrentUser | null> => {
    const raw = await AsyncStorage.getItem(KEYS.user);
    return raw ? JSON.parse(raw) : null;
};

export const removeUser = () =>
    AsyncStorage.removeItem(KEYS.user);

// ── Clear all (logout) ───────────────────────────────────
export const clearAuth = () =>
    AsyncStorage.multiRemove([KEYS.token, KEYS.user]);
