// src/hooks/useMyTree.ts
import { useState, useEffect, useCallback } from 'react';
import { treeApi } from '@/src/constants/treeApi';

export interface TreeData {
    userId:           string;
    stage:            'SEED' | 'SPROUT' | 'YOUNG' | 'GROWING' | 'FLOWER' | 'FRUIT' | 'ANCIENT';
    health:           number;
    healthStatus:     string;
    fruits:           number;
    flowers:          number;
    hasBird:          boolean;
    hasAura:          boolean;
    lastHealthUpdate: string;
}

// axiosClient đôi khi wrap thêm lớp { data: ... }
function extractTree(res: any): TreeData | null {
    if (!res) return null;
    // Trường hợp 1: res chính là object cây { userId, stage, ... }
    if (res.stage) return res as TreeData;
    // Trường hợp 2: res.data là object cây
    if (res.data?.stage) return res.data as TreeData;
    console.warn('[useMyTree] Không nhận dạng được cấu trúc response:', res);
    return null;
}

export function useMyTree() {
    const [tree,    setTree]    = useState<TreeData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTree = useCallback(async () => {
        try {
            setLoading(true);
            const res = await treeApi.getMyTree();
            setTree(extractTree(res));
        } catch (error) {
            console.error('[useMyTree] Lỗi lấy dữ liệu cây:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const waterTree = useCallback(async () => {
        try {
            const res = await treeApi.waterTree();
            const updated = extractTree(res);
            if (updated) setTree(updated);
            return updated;
        } catch (error: any) {
            console.error('[useMyTree] Lỗi tưới cây:', error);
            // Trả về message lỗi để UI hiển thị (vd: "đã tưới hôm nay rồi")
            throw error;
        }
    }, []);

    useEffect(() => { fetchTree(); }, [fetchTree]);

    return { tree, loading, refreshTree: fetchTree, waterTree };
}
