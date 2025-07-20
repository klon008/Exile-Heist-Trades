
export interface PoeItemModifier {
  text: string;
  optional: boolean;
}

export interface PoeItem {
  id: number;
  name: string;
  icon: string;
  links?: number;
  levelRequired?: number;
  baseType?: string;
  itemClass?: number;
  chaosValue: number;
  exaltedValue?: number;
  divineValue?: number;
  count?: number;
  detailsId?: string;
  listingCount?: number;
  currencyTypeName?: string; // For currencies before mapping
  variant?: string;
  category: string;
  implicitModifiers?: PoeItemModifier[];
  explicitModifiers?: PoeItemModifier[];
}

export interface PoeLeague {
  id: string;
  realm: string;
  url: string;
  startAt: string;
  endAt: string | null;
  description: string;
  registerAt: string;
  delveEvent: boolean;
  rules: { id: string; name: string; description: string }[];
  category?: {
    id: string;
    current?: boolean;
  };
}
