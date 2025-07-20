
import type { PoeLeague, PoeItem } from '@/types';

// prettier-ignore
const BASE_TYPE_NAMES = new Set([
  'Transfer-attuned Spirit Shield', 'Subsuming Spirit Shield', 'Exhausting Spirit Shield',
  'Cold-attuned Buckler', 'Polar Buckler', 'Endothermic Buckler',
  'Heat-attuned Tower Shield', 'Magmatic Tower Shield', 'Exothermic Tower Shield',
  'Mechalarm Belt', 'Micro-Distillery Belt',
  'Simplex Amulet', 'Astrolabe Amulet',
  'Geodesic Ring', 'Cogwork Ring', 'Manifold Ring',
  'Impact Force Propagator', 'Crushing Force Magnifier', 'Blunt Force Condenser',
  'Banishing Blade', 'Blasting Blade', 'Rebuking Blade',
  'Apex Cleaver', 'Honed Cleaver', 'Prime Cleaver',
  'Eventuality Rod', 'Potentiality Rod', 'Capacity Rod',
  'Battery Staff', 'Reciprocation Staff', 'Transformer Staff',
  'Solarine Bow', 'Foundry Bow', 'Hedron Bow',
  'Alternating Sceptre', 'Stabilising Sceptre', 'Oscillating Sceptre',
  'Boom Mace', 'Crack Mace', 'Flare Mace',
  'Anarchic Spiritblade', 'Capricious Spiritblade', 'Fickle Spiritblade',
  'Psychotic Axe', 'Disapprobation Axe', 'Maltreatment Axe',
  'Void Fangs', 'Malign Fangs', 'Shadow Fangs',
  'Infernal Blade', 'Flashfire Blade', 'Flickerflame Blade',
  'Pneumatic Dagger', 'Pressurised Dagger', 'Hollowpoint Dagger',
  'Accumulator Wand', 'Congregator Wand', 'Assembler Wand',
]);

const CURRENCY_NAMES = new Set([
  'Tailoring Orb',
  'Tempering Orb',
  'Secondary Regrading Lens',
  'Prime Regrading Lens',
]);

const ADDITIONAL_HEIST_UNIQUES = new Set([
    'The Hidden Blade',
    'Fated End', 'Shattershard', 'Crest of Desire',
    'Expedition\'s End', 'The Fulcrum', 'The Iron Mass',
    'Actum', 'Font of Thunder'
]);

async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request to ${url} failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, delay * (i + 1)));
    }
  }
}

async function getLeagueName(): Promise<string> {
  const data: PoeLeague[] = await fetchWithRetry('https://api.pathofexile.com/leagues');
  const currentLeague = data.find(league => league.category?.current === true);
  if (!currentLeague) {
    throw new Error('Could not find the current league. The Path of Exile API might be down or a new league has not started.');
  }
  return currentLeague.id;
}

const assignCategory = (items: any[], category: string): PoeItem[] => {
    return items.map(item => ({...item, category}));
}

export async function fetchAllItems(): Promise<{ items: PoeItem[], currencyIcons: { chaos: string, divine: string } }> {
  const leagueName = await getLeagueName();

  const itemCategories = ['UniqueJewel', 'UniqueFlask', 'UniqueWeapon', 'UniqueArmour', 'UniqueAccessory'];
  
  const urlsToFetch = [
    ...itemCategories.map(cat => `https://poe.ninja/api/data/itemoverview?league=${leagueName}&type=${cat}`),
    `https://poe.ninja/api/data/itemoverview?league=${leagueName}&type=BaseType`,
    `https://poe.ninja/api/data/currencyoverview?league=${leagueName}&type=Currency`,
  ];

  const results = await Promise.all(urlsToFetch.map(url => fetchWithRetry(url).catch(e => {
    console.error(e);
    return { lines: [], currencyDetails: [] }; // Prevent Promise.all from failing on a single error
  })));

  const [
    uniqueJewels,
    uniqueFlasks,
    uniqueWeapons,
    uniqueArmour,
    uniqueAccessories,
    baseTypes,
    currencies,
  ] = results;

  const currencyIcons = {
    chaos: currencies?.currencyDetails?.find((c: any) => c.name === 'Chaos Orb')?.icon || '',
    divine: currencies?.currencyDetails?.find((c: any) => c.name === 'Divine Orb')?.icon || '',
  }
  
  const allUniques: PoeItem[] = [
    ...assignCategory(uniqueJewels.lines || [], 'UniqueJewel'),
    ...assignCategory(uniqueFlasks.lines || [], 'UniqueFlask'),
    ...assignCategory(uniqueWeapons.lines || [], 'UniqueWeapon'),
    ...assignCategory(uniqueArmour.lines || [], 'UniqueArmour'),
    ...assignCategory(uniqueAccessories.lines || [], 'UniqueAccessory'),
  ];
  
  const heistUniques = allUniques.filter(item => 
    (item.name && item.name.includes('Replica')) || ADDITIONAL_HEIST_UNIQUES.has(item.name)
  );

  const filteredBaseTypes: PoeItem[] = assignCategory(
    (baseTypes.lines || []).filter((item: PoeItem) => BASE_TYPE_NAMES.has(item.name)),
    'BaseType'
  );
  
  const currencyDetailsMap = new Map((currencies.currencyDetails || []).map((detail: any) => [detail.name, detail]));

  const filteredCurrencies: PoeItem[] = assignCategory(
    (currencies.lines || [])
      .filter((item: any) => CURRENCY_NAMES.has(item.currencyTypeName))
      .map((item: any) => {
        const details = currencyDetailsMap.get(item.currencyTypeName);
        return {
          ...item,
          id: details?.id || item.detailsId,
          name: item.currencyTypeName,
          chaosValue: item.chaosEquivalent,
          icon: details?.icon || '',
        };
      }),
    'Currency'
  );

  const mergedData = [...heistUniques, ...filteredBaseTypes, ...filteredCurrencies];
  
  const items = mergedData.sort((a, b) => (b.chaosValue || 0) - (a.chaosValue || 0));

  return { items, currencyIcons };
}
