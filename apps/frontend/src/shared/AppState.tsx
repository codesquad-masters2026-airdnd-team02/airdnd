import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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

/** 로그인 여부를 UI 표시용으로 기억하는 localStorage 키 (실제 인증은 세션 쿠키가 담당) */
const LOGIN_FLAG_KEY = 'airdnd_logged_in';

interface AppStateValue {
  search: SearchState;
  setSearch: (s: SearchState) => void;
  selectedListing: Listing;
  setSelectedListing: (l: Listing) => void;
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH);
  const [selectedListing, setSelectedListing] = useState<Listing>(LISTINGS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem(LOGIN_FLAG_KEY) === 'true'
  );

  const setLoggedIn = (v: boolean) => {
    setIsLoggedIn(v);
    if (v) localStorage.setItem(LOGIN_FLAG_KEY, 'true');
    else localStorage.removeItem(LOGIN_FLAG_KEY);
  };

  // 앱 로드 시 서버 세션을 조회해 로그인 상태를 확정한다 (localStorage 플래그는 깜빡임 방지용 초기값일 뿐, 서버가 진실).
  useEffect(() => {
    let alive = true;
    fetch('http://localhost:8080/api/auth/session', { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (alive) setLoggedIn(Boolean(json?.data?.authenticated));
      })
      .catch(() => {
        /* 조회 실패 시 기존 플래그 유지 */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AppStateContext.Provider
      value={{ search, setSearch, selectedListing, setSelectedListing, isLoggedIn, setLoggedIn }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
