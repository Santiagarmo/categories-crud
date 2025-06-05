import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onAddCategory: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header: FC<HeaderProps> = ({ onAddCategory, searchTerm, onSearchChange }) => {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">Category Commander</h1>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Input
            type="search"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-xs w-full sm:w-auto bg-background focus:ring-accent"
          />
          <Button onClick={onAddCategory} variant="default" className="shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Category
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
