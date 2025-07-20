
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ItemCard } from '@/components/item-card';
import type { PoeItem } from '@/types';
import { Search, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ItemGridProps {
  items: PoeItem[];
  currencyIcons: {
    chaos: string;
    divine: string;
  };
}

const CATEGORIES = [
  'UniqueJewel',
  'UniqueFlask',
  'UniqueWeapon',
  'UniqueArmour',
  'UniqueAccessory',
  'BaseType',
  'Currency',
];

const formatCategoryName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function ItemGrid({ items, currencyIcons }: ItemGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hideInfluenced, setHideInfluenced] = useState(false);
  const [hideLinked, setHideLinked] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => {
        const newSelection = checked ? [...prev, category] : prev.filter(c => c !== category);
        return newSelection;
    });
  }

  const filteredItems = useMemo(() => {
    const trimmedQuery = debouncedSearchQuery.trim().toLowerCase();
    
    return items.filter(item => {
      const matchesSearch = trimmedQuery ? item.name.toLowerCase().includes(trimmedQuery) : true;
      const isInfluenced = !!item.variant;
      
      if (hideInfluenced && isInfluenced) {
        return false;
      }
      
      if (hideLinked && (item.links === 5 || item.links === 6)) {
        return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }

      return matchesSearch;
    });
  }, [debouncedSearchQuery, items, hideInfluenced, selectedCategories, hideLinked]);

  return (
    <div>
      <div className="mx-auto mb-4 max-w-4xl">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for an item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg py-6 pl-10 text-lg focus-visible:ring-accent"
            aria-label="Search for an item"
          />
        </div>
        
        <Card className="p-4">
            <CardContent className="p-0">
                <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Filters</h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="hide-influenced"
                            checked={hideInfluenced}
                            onCheckedChange={(checked) => setHideInfluenced(checked as boolean)}
                        />
                        <Label htmlFor="hide-influenced" className="cursor-pointer text-muted-foreground">
                            Hide influenced items
                        </Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="hide-linked"
                            checked={hideLinked}
                            onCheckedChange={(checked) => setHideLinked(checked as boolean)}
                        />
                        <Label htmlFor="hide-linked" className="cursor-pointer text-muted-foreground">
                            Hide 5L/6L items
                        </Label>
                    </div>
                </div>
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {CATEGORIES.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                             <Checkbox 
                                id={`cat-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                            />
                            <Label htmlFor={`cat-${category}`} className="cursor-pointer text-muted-foreground text-sm">
                                {formatCategoryName(category)}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>


      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-in fade-in-0">
          {filteredItems.map((item, index) => (
            <div key={`${item.id}-${item.name}-${item.variant || index}-${item.links || ''}`}>
              <ItemCard item={item} currencyIcons={currencyIcons} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-xl text-muted-foreground">No items found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
