import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { client } from './shared/api/generated/client.gen'
import './index.css'
import App from './App.tsx'
import { client } from './shared/api/generated/client.gen'
import { refreshingFetch } from './shared/api/http'

// 자동생성 API 클라이언트 런타임 설정.
// - baseUrl: 페이지와 API 호스트를 같은 사이트(localhost)로 맞춰 SameSite=Lax 세션 쿠키가 실리게 한다.
//   (WSL2 환경에서 브라우저는 localhost 로만 백엔드에 닿으므로 127.0.0.1 은 사용 불가)
// - credentials: 모든 요청에 세션 쿠키 동반.
// - fetch: 401(액세스 만료) 시 자동 재발급+재시도하는 래퍼로 교체 → host/listing 등 생성 클라이언트 경로 전반에 적용.
// client.gen.ts 는 재생성 시 덮어써지므로 여기서 setConfig 로 덮어쓴다.
client.setConfig({ baseUrl: 'http://localhost:8080', credentials: 'include', fetch: refreshingFetch })

// OpenAPI가 @ModelAttribute(condition/pageRequest)를 중첩 객체로 노출하지만,
// 서버는 flat 쿼리(size=, cursor=)를 기대한다. 객체명 prefix 없이 한 단계 펼쳐 직렬화.
function flatQuerySerializer(query: Record<string, unknown>): string {
  const sp = new URLSearchParams()
  // 키 경로로 재귀 직렬화. 중첩 객체는 점 표기(mapBounds.south=) — @ModelAttribute 바인딩용
  const append = (key: string, val: unknown) => {
    if (val == null || val === '') return
    if (Array.isArray(val)) {
      val.forEach(v => append(key, v))
    } else if (typeof val === 'object') {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) append(`${key}.${k}`, v)
    } else {
      sp.append(key, String(val))
    }
  }
  // 최상위 컨테이너(condition/pageRequest)는 이름 없이 한 단계 펼침
  for (const [key, value] of Object.entries(query)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const [k2, v2] of Object.entries(value as Record<string, unknown>)) append(k2, v2)
    } else {
      append(key, value)
    }
  }
  return sp.toString()
}

// 생성 클라이언트 baseUrl을 env로 통일(재생성 전에도 즉시 적용).
// 재생성 후에는 openapi-ts runtimeConfigPath(hey-api.ts)가 동일하게 보장.
client.setConfig({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  querySerializer: flatQuerySerializer,
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
