import { createContext, useContext, useState, type ReactNode } from 'react';
import { LISTINGS } from '../pages/Results';
import type { SearchState, Listing } from '../types';

const DEFAULT_SEARCH: SearchState = {
  dates: '',
  range: null,
  price: null,
  priceLabel: '',
  guests: { adult: 1, child: 0, infant: 0, pet: 0 },
  guestLabel: '',
};

interface AppStateValue {
  search: SearchState;
  setSearch: (s: SearchState) => void;
  selectedListing: Listing;
  setSelectedListing: (l: Listing) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH);
  const [selectedListing, setSelectedListing] = useState<Listing>(LISTINGS[0]);

  return (
    <AppStateContext.Provider value={{ search, setSearch, selectedListing, setSelectedListing }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
