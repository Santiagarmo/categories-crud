"use client";
import { useState, useEffect, useMemo } from 'react';
import type { Category, CategoryFormData } from '@/lib/types';
import Header from '@/pages/categories/components/layout/header';
import CategoryGrid from '@/pages/categories/components/categories/SkeletonCard';
import CategoryEditModal from '@/pages/categories/components/categories/EditCategory';
import CategoryDeleteDialog from '@/pages/categories/components/categories/DeleteCategoryModal';
import { toast as sonnerToast } from 'sonner'; 
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Gadgets and devices', color: '#3B82F6', is_active: true, parent_id: null, sort_order: 0, icon: 'Smartphone', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'Books', description: 'Printed and digital books', color: '#10B981', is_active: true, parent_id: null, sort_order: 1, icon: 'BookOpen', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'Clothing', description: 'Apparel and accessories', color: '#8B5CF6', is_active: false, parent_id: null, sort_order: 2, icon: 'Shirt', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', name: 'Mobile Phones', description: 'Latest mobile phones', color: '#2563EB', is_active: true, parent_id: '1', sort_order: 0, icon: 'Smartphone', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeletingCategoryState, setIsDeletingCategoryState] = useState(false);

  const [isTogglingStatusForId, setIsTogglingStatusForId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setTimeout(() => {
      const orderedInitialCategories = initialCategories.map((cat, index) => ({ ...cat, sortOrder: index }));
      setCategories(orderedInitialCategories);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmitCategory = async (data: CategoryFormData) => {
    setIsSubmittingForm(true);
    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      if (data.id) { 
        setCategories(prev => prev.map(cat => cat.id === data.id ? { ...cat, ...data, updated_at: new Date().toISOString() } as Category : cat));
        sonnerToast.success('Success', { description: `Category "${data.name}" updated.` });
      } else { 
        const newCategory: Category = {
          ...data,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sort_order: categories.length > 0 ? Math.max(...categories.map(c => c.sort_order)) + 1 : 0,
        };
        setCategories(prev => [...prev, newCategory]);
        sonnerToast.success('Success', { description: `Category "${data.name}" created.` });
      }
      handleCloseModal();
    } catch (error) {
      sonnerToast.error('Error', { description: 'Failed to save category.' });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeletingCategoryState(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    
    try {
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id && cat.parent_id !== deletingCategory.id));
      sonnerToast.success('Success', { description: `Category "${deletingCategory.name}" deleted.` });
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch (error) {
      sonnerToast.error('Error', { description: 'Failed to delete category.' });
    } finally {
      setIsDeletingCategoryState(false);
    }
  };
  
  const handleToggleCategoryStatus = async (categoryId: string, is_active: boolean) => {
    setIsTogglingStatusForId(categoryId);
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, is_active, updated_at: new Date().toISOString() } : cat
        )
      );
      sonnerToast.info('Status Updated', { description: `Category status changed to ${is_active ? 'active' : 'inactive'}.`});
    } catch (error) {
      sonnerToast.error('Error', { description: 'Failed to update status.' });
    } finally {
      setIsTogglingStatusForId(null);
    }
  };

  const filteredCategories = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return categories
      .filter(category =>
        category.name.toLowerCase().includes(lowerSearchTerm) ||
        category.description.toLowerCase().includes(lowerSearchTerm)
      )
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [categories, searchTerm]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (searchTerm) {
        sonnerToast.info("Reordering Best Without Filters", { 
          description: "For consistent global ordering, please clear search filters before reordering categories."
        });
      }

      setCategories((items) => {
        const sourceArrayForIndices = searchTerm ? filteredCategories : items;
        
        const oldIndex = sourceArrayForIndices.findIndex((item) => item.id === active.id);
        const newIndex = sourceArrayForIndices.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return items;

        let reorderedItems;
        if (searchTerm) {
          const reorderedFiltered = arrayMove([...filteredCategories], oldIndex, newIndex);
          const reorderedFilteredWithNewSort = reorderedFiltered.map((item, index) => ({
            ...item,
            sort_order: index 
          }));
          
          const sortOrderMap = new Map(reorderedFilteredWithNewSort.map(item => [item.id, item.sort_order]));

          reorderedItems = items.map(item => {
            if (sortOrderMap.has(item.id)) {
              return { ...item, sort_order: sortOrderMap.get(item.id)! };
            }
            return item;
          });
        } else {
          const newFullOrder = arrayMove([...items], oldIndex, newIndex);
          reorderedItems = newFullOrder.map((item, index) => ({
            ...item,
            sort_order: index,
          }));
        }
        return reorderedItems;
      });
      sonnerToast.success('Success', { description: "Category order updated." });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          onAddCategory={handleAddCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main className="flex-grow container mx-auto px-0 sm:px-4 py-4">
          <CategoryGrid
            categories={filteredCategories}
            allCategories={categories} 
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onToggleCategoryStatus={handleToggleCategoryStatus}
            isTogglingStatusForId={isTogglingStatusForId}
          />
        </main>
        {isModalOpen && (
          <CategoryEditModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            category={editingCategory}
            categories={categories}
            onSubmit={handleSubmitCategory}
            isSubmitting={isSubmittingForm}
          />
        )}
        {deletingCategory && (
          <CategoryDeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            categoryName={deletingCategory.name}
            hasSubcategories={categories.some(cat => cat.parent_id === deletingCategory.id)}
            isDeleting={isDeletingCategoryState}
          />
        )}
      </div>
    </DndContext>
  );
}
