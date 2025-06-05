import type { FC } from 'react';
import type { Category } from '@/lib/types';
import CategoryCard from './CategoryCard';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

interface CategoryGridProps {
  categories: Category[];
  allCategories: Category[]; // Used to find parent names
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onToggleCategoryStatus: (categoryId: string, is_active: boolean) => Promise<void>;
  isTogglingStatusForId: string | null;
}

const CategoryGrid: FC<CategoryGridProps> = ({ 
  categories, 
  allCategories,
  onEditCategory, 
  onDeleteCategory, 
  onToggleCategoryStatus,
  isTogglingStatusForId 
}) => {
  if (categories.length === 0) {
    return <p className="text-center text-muted-foreground py-10">No categories found. Try adjusting your search or add a new category.</p>;
  }

  const getParentName = (parent_id: string | null | undefined) => {
  if (!parent_id) return undefined;
  const parent = allCategories.find(cat => cat.id === parent_id);
  return parent?.name;
};

  return (
    <SortableContext items={categories.map(c => c.id)} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
            onToggleStatus={onToggleCategoryStatus}
            isTogglingStatus={isTogglingStatusForId === category.id}
            parentCategoryName={getParentName(category.parent_id)}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default CategoryGrid;
