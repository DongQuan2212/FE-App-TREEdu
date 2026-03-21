export interface Topic {
    id: string;
    name: string;
    description: string;
    level: 1 | 2 | 3;
    icon: string;
}

export type SortOption = 'name' | 'level';
