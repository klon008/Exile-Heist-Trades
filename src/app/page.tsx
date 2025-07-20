
"use client";

import { useState, useEffect } from 'react';
import type { PoeItem } from '@/types';
import { Loader } from '@/components/loader';
import { ItemGrid } from '@/components/item-grid';

export default function Home() {
  const [items, setItems] = useState<PoeItem[]>([]);
  const [currencyIcons, setCurrencyIcons] = useState<{ chaos: string, divine: string }>({ chaos: '', divine: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/poe-items');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch items');
        }
        const { items: allItems, currencyIcons: fetchedIcons } = await response.json();
        setItems(allItems);
        setCurrencyIcons(fetchedIcons);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center p-4">
        <h2 className="text-2xl font-headline text-destructive">Error Fetching Data</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline sm:text-5xl">
          Exile Heist Trades
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Instantly search for valuable Heist items in the current Path of Exile league.
        </p>
      </div>
      <ItemGrid items={items} currencyIcons={currencyIcons} />
    </main>
  );
}
