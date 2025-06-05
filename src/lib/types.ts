  export interface Category {
    id: string;
    name: string;
    description: string;
    color: string;
    is_active: boolean;
    parent_id?: string | null;
    icon_url?: string;
    sort_order: number;
    icon: string;
    created_at?: string | null;
    updated_at?: string | null;
  }

  export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };