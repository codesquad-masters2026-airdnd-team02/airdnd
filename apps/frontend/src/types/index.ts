export interface GuestCounts {
  adult: number;
  child: number;
  infant: number;
}

export interface DateRange {
  a: string | null;
  b: string | null;
}

export interface SearchState {
  dates: string;
  range: DateRange | null;
  price: number | null;
  priceLabel: string;
  guests: GuestCounts;
  guestLabel: string;
}

export interface Listing {
  img: string;
  loc: string;
  title: string;
  specs: string;
  amen: string;
  rating: number;
  reviews: number;
  price: number;
  total: number;
  x: number;
  y: number;
}

export type RoomType = '집 전체' | '개인실' | '다인실';

export interface HostListing {
  id: string;
  title: string;
  loc: string;
  roomType: RoomType;
  description: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  imageUrls: string[];
  active: boolean;
}

export type View = 'home' | 'results' | 'detail' | 'host-dashboard' | 'host-new' | 'host-edit';
