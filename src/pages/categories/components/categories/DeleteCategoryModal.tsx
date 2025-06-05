import type { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  categoryName: string;
  hasSubcategories: boolean;
  isDeleting: boolean;
}

const CategoryDeleteDialog: FC<CategoryDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  hasSubcategories,
  isDeleting,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete &quot;{categoryName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. 
            {hasSubcategories && (
              <span className="font-semibold text-destructive block mt-2">
                Warning: This category contains subcategories. Deleting it will also affect them (they might be orphaned or deleted based on system policy).
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryDeleteDialog;