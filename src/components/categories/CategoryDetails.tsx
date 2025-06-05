import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Category, CategoryFormData } from '@/lib/types';
import DynamicIcon from '@/pages/categories/components/DynamicIcon';

const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex code (e.g., #FFFFFF).' }),
  is_active: z.boolean(),
  parent_id: z.string().nullable().optional(),
  sort_order: z.coerce.number().int().min(0),
  icon: z.string(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category | null;
  categories: Category[]; // For parent category selection
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const NONE_PARENT_VALUE = "__NONE__"; // Special value for "None" parent

const CategoryForm: FC<CategoryFormProps> = ({ category, categories, onSubmit, onCancel, isSubmitting }) => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category ? {
      id: category.id,
      name: category.name ?? '',
      description: category.description ?? '',
      color: category.color ?? '#4F46E5',
      is_active: category.is_active ?? true,
      parent_id: category.parent_id ?? null,
      sort_order: category.sort_order ?? 0,
      icon: category.icon ?? 'Package',
    } : {
      name: '',
      description: '',
      color: '#4F46E5',
      is_active: true,
      parent_id: null,
      sort_order: 0,
      icon: 'Package',
    },
  });

  const watchedIcon = form.watch('icon');
  const watchedColor = form.watch('color');

  const handleSubmit = async (data: CategoryFormValues) => {
    const dataToSubmit: CategoryFormData = {
      ...data,
      parent_id: data.parent_id === NONE_PARENT_VALUE ? null : data.parent_id,
    };
    if (category?.id) {
      (dataToSubmit as CategoryFormData & { id: string }).id = category.id;
    }
    await onSubmit(dataToSubmit);
  };
  
  const availableParentCategories = categories.filter(c => c.id !== category?.id);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Electronics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Briefly describe the category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Color</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input type="text" placeholder="#RRGGBB" {...field} className="w-full" />
                  </FormControl>
                  <div
                    className="w-8 h-8 rounded border border-input"
                    style={{ backgroundColor: watchedColor.match(/^#[0-9A-Fa-f]{6}$/) ? watchedColor : 'transparent' }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Name (Lucide)</FormLabel>
                 <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="e.g., Package, Shirt" {...field} />
                    </FormControl>
                    {watchedIcon && <DynamicIcon name={watchedIcon} className="h-8 w-8 p-1 border rounded" />}
                  </div>
                <FormDescription>Enter a valid Lucide icon name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === NONE_PARENT_VALUE ? null : value)} 
                  value={field.value === null ? NONE_PARENT_VALUE : field.value || NONE_PARENT_VALUE}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NONE_PARENT_VALUE}>None</SelectItem>
                    {availableParentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Is this category currently available?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (category ? 'Save Changes' : 'Create Category')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;