# **App Name**: Exile Trades

## Core Features:

- League Fetching: Fetch the current Path of Exile league from the official API (https://api.pathofexile.com/leagues) to use in subsequent API calls.
- Unique Item Data Fetching: Retrieve data from the poe.ninja API for Unique Jewels, Flasks, Weapons, Armour, and Accessories using the current league name. (https://poe.ninja/api/data/itemoverview)
- Replica Filter: Filter the Unique Items data to include only items with "Replica" in their name.
- Base Type Data Fetching: Retrieve base type data and filter by specific item names. (https://poe.ninja/api/data/itemoverview)
- Currency Data Fetching: Fetch currency data and filter for tailoring orbs etc (https://poe.ninja/api/data/currencyoverview).
- Data Merging: Merge all fetched and filtered data into a single JSON object.
- Instant Search: Implement a search input that instantly filters and displays items from the merged JSON data, with case-insensitive and trim support.
- Preloader Animation: Display a preloader animation while fetching data from the APIs.

## Style Guidelines:

- Primary color: Gold (#FFD700) to reflect the in-game currency and loot. 
- Background color: Dark gray (#333333) to provide contrast and a sophisticated feel. 
- Accent color: Cyan (#00FFFF) for highlights and interactive elements.
- Font pairing: 'Space Grotesk' (sans-serif) for headings and 'Inter' (sans-serif) for body text. 
- Use a grid-based layout to display item data in a clear and organized manner.
- Subtle transitions and animations when search results update.