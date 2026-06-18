/**
 * 지도 추상화 레이어.
 * 현재 구현체는 카카오맵. 추후 구글맵 등으로 교체 시 이 파일만 바꾸면 됨
 * (호출부는 Coord/MapController 인터페이스에만 의존).
 */

export interface Coord {
  lat: number;
  lng: number;
}

export interface HtmlMarkerOptions {
  coord: Coord;
  element: HTMLElement;
  onClick?: () => void;
  /** 콘텐츠 기준 앵커(아래로 내릴수록 ↑). 기본 1 */
  yAnchor?: number;
}

export interface MarkerHandle {
  /** 마커(오버레이) 쌓임 순서 변경 — hover 시 앞으로 보내기 등 */
  setZIndex(z: number): void;
  /** 지도에서 제거 */
  remove(): void;
}

export interface MapController {
  /** 한 단계 확대(애니메이션) */
  zoomIn(): void;
  /** 한 단계 축소(애니메이션) */
  zoomOut(): void;
  /** 지도 중심 이동(즉시) */
  setCenter(coord: Coord): void;
  /** 지도 중심 이동(애니메이션, 줌 유지) */
  panTo(coord: Coord): void;
  /** 주어진 좌표들이 모두 보이도록 영역 맞춤(센터+줌 자동) */
  fitBounds(coords: Coord[]): void;
  /** HTML 마커 추가. 핸들 반환 */
  addHtmlMarker(options: HtmlMarkerOptions): MarkerHandle;
  /** 컨테이너 휠 줌을 애니메이션 줌으로 대체. 정리 함수 반환 */
  enableWheelZoom(): () => void;
}

const MIN_LEVEL = 1;
const MAX_LEVEL = 14;

let sdkPromise: Promise<void> | null = null;

/** 지도 SDK 로드(싱글톤) */
export function loadMapSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps?.services) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&libraries=services&autoload=false`;
    script.onload = () => window.kakao.maps.load(() => resolve());
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error('지도 SDK 로드 실패'));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

/** 지도 생성 + 컨트롤러 반환 */
export async function createMap(
  container: HTMLElement,
  opts: { center: Coord; level?: number },
): Promise<MapController> {
  await loadMapSdk();

  const map = new window.kakao.maps.Map(container, {
    center: new window.kakao.maps.LatLng(opts.center.lat, opts.center.lng),
    level: opts.level ?? 6,
  });

  const setLevel = (next: number) =>
    map.setLevel(Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, next)), { animate: { duration: 200 } });

  return {
    zoomIn: () => setLevel(map.getLevel() - 1),
    zoomOut: () => setLevel(map.getLevel() + 1),
    setCenter: coord => map.setCenter(new window.kakao.maps.LatLng(coord.lat, coord.lng)),
    panTo: coord => map.panTo(new window.kakao.maps.LatLng(coord.lat, coord.lng)),
    fitBounds: coords => {
      if (coords.length === 0) return;
      const bounds = new window.kakao.maps.LatLngBounds();
      coords.forEach(c => bounds.extend(new window.kakao.maps.LatLng(c.lat, c.lng)));
      map.setBounds(bounds);
    },
    addHtmlMarker: ({ coord, element, onClick, yAnchor = 1 }) => {
      if (onClick) element.addEventListener('click', onClick);
      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position: new window.kakao.maps.LatLng(coord.lat, coord.lng),
        content: element,
        yAnchor,
      });
      return {
        setZIndex: z => overlay.setZIndex(z),
        remove: () => overlay.setMap(null),
      };
    },
    enableWheelZoom: () => {
      map.setZoomable(false);
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        setLevel(map.getLevel() + (e.deltaY > 0 ? 1 : -1));
      };
      container.addEventListener('wheel', onWheel, { passive: false });
      return () => container.removeEventListener('wheel', onWheel);
    },
  };
}

/** 주소 → 좌표 (지오코딩). 실패 시 null */
export async function geocode(address: string): Promise<Coord | null> {
  await loadMapSdk();
  return new Promise(resolve => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
        resolve(null);
        return;
      }
      resolve({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
    });
  });
}
