export interface Category {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  color: string;
  is_active: boolean;
  parent_id?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  icon_url?: File | null;
  color: string;
  is_active: boolean;
  parent_id?: string | null;
  sort_order: number;
}
