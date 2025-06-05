import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CategoryForm from './CategoryDetails';
import type { Category, CategoryFormData } from '@/lib/types';

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  categories: Category[];
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isSubmitting: boolean;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({
  isOpen,
  onClose,
  category,
  categories,
  onSubmit,
  isSubmitting,
}) => {
  const title = category ? 'Edit Category' : 'Create New Category';
  const description = category
    ? 'Update the details of this category.'
    : 'Fill in the form below to add a new category.';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <CategoryForm
          category={category}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditModal;
