
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PoeItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Layers } from 'lucide-react';

interface ItemCardProps {
  item: PoeItem;
  currencyIcons: {
    chaos: string;
    divine: string;
  };
}

export function ItemCard({ item, currencyIcons }: ItemCardProps) {
  const showDivineValue = item.divineValue && item.divineValue >= 1;
  const value = showDivineValue ? item.divineValue : item.chaosValue;
  const currencyIcon = showDivineValue ? currencyIcons.divine : currencyIcons.chaos;
  const currencyAlt = showDivineValue ? "Divine Orb" : "Chaos Orb";
  const hasModifiers = (item.implicitModifiers && item.implicitModifiers.length > 0) || (item.explicitModifiers && item.explicitModifiers.length > 0);

  return (
    <Card className="group relative flex h-full flex-col bg-card transition-all hover:z-10 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="flex-grow p-4 pb-2">
        <div className="flex items-start gap-4">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="relative">
                  {item.icon && (
                      <Image
                      src={item.icon}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="mt-1 rounded-md"
                      unoptimized
                      />
                  )}
                </div>
              </TooltipTrigger>
              {hasModifiers && (
                <TooltipContent side="right" align="start" className="w-80 max-h-96 overflow-y-auto">
                  <div className="flex flex-col gap-2 p-1">
                     {item.implicitModifiers && item.implicitModifiers.map((mod, index) => (
                      <div key={`implicit-${index}`} className="text-sm text-yellow-300">{mod.text}</div>
                    ))}
                    {item.implicitModifiers && item.explicitModifiers && item.implicitModifiers.length > 0 && item.explicitModifiers.length > 0 && (
                      <hr className="border-border my-1"/>
                    )}
                    {item.explicitModifiers && item.explicitModifiers.map((mod, index) => (
                      <div key={`explicit-${index}`} className="text-sm text-blue-300">{mod.text}</div>
                    ))}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1 min-w-0">
            <CardTitle className="font-headline text-base leading-tight">{item.name}</CardTitle>
            {item.baseType && <CardDescription className="text-xs">{item.baseType}</CardDescription>}
            <div className="mt-2 flex flex-col gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {item.levelRequired && (
                  <Badge variant="outline">iLvl: {item.levelRequired}</Badge>
                )}
              </div>
              {item.variant && (
                <div className="w-full">
                  <Badge variant="outline" className="text-yellow-300 border-yellow-300/50 whitespace-normal h-auto w-full text-center justify-center">
                    {item.variant.replace(/\//g, ' / ')}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between p-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {item.links && item.links > 0 ? (
            <Badge variant="secondary">{item.links}L</Badge>
          ) : <div />}
          {item.listingCount && (
              <div className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{item.listingCount}</span>
              </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
           <span className="text-lg font-bold text-primary">{value?.toLocaleString()}</span>
           {currencyIcon && (
             <div className="relative h-6 w-6">
              <Image src={currencyIcon} alt={currencyAlt} fill unoptimized/>
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
