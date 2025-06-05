import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import DynamicIcon from '@/pages/categories/components/DynamicIcon'
import type { Category } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (categoryId: string, isActive: boolean) => Promise<void>;
  isTogglingStatus: boolean;
  parentCategoryName?: string;
}

const CategoryCard: FC<CategoryCardProps> = ({
    category,
    onEdit,
    onDelete,
    onToggleStatus,
    isTogglingStatus,
    parentCategoryName,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id })

    const style :  React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };

    return(
        <Card ref={setNodeRef} style={style} className={cn("flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out touch-manipulation", isDragging && "opacity-75 shadow-2xl z-50" )}>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-3">
                    <div {...attributes} {...listeners} className="cursor-grab p-1 -ml-1 text-muted-foreground hover:text-foreground ">
                        <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="p-2 rounded-lg flex items-center justify-center shrink-0 w-10 h-10" 
                    style={{backgroundColor: category.color + "20"}}>
                        <DynamicIcon name={category.icon} style={{ color: category.color }} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight truncate">{category.name}</CardTitle>
                        { parentCategoryName && (
                            <Badge variant={"outline"} className="mt-1 text-xs">
                                <ExternalLink className="w-3 h-3 mr-1"/>
                                {parentCategoryName}
                            </Badge>
                                )}
                    </div>
                    <Switch checked={category.is_active}
                    onCheckedChange={(checked) => onToggleStatus(category.id, checked)}
                    disabled={isTogglingStatus}
                    aria-label={`Toggle status for ${category.name}`}
                    />
                </CardHeader>
                <CardContent className="flex-grow pb-3">
                    <CardDescription className="text-sm line-clamp-3 min-h-[3.75rem]">
                        {category.description || "No description provided."}
                    </CardDescription>

                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-full mr-1.5" style={{backgroundColor: category.color}}></div>
                        <span>Color: {category.color}</span>
                        <span className="mx-1.5">·</span>
                        <span>Sort Order: {category.sort_order}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-3">
                    <Button variant="outline" size="sm" onClick={() => onEdit(category)} className="hover:bg-accent/20">
                    <Edit3 className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(category)} className="hover:bg-destructive/80">
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                </CardFooter>


        </Card>
    )
}

export default CategoryCard;