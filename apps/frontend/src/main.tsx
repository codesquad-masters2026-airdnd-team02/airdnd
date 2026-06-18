import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { client } from './shared/api/generated/client.gen'
import './index.css'
import App from './App.tsx'

// OpenAPI가 @ModelAttribute(condition/pageRequest)를 중첩 객체로 노출하지만,
// 서버는 flat 쿼리(size=, cursor=)를 기대한다. 객체명 prefix 없이 한 단계 펼쳐 직렬화.
function flatQuerySerializer(query: Record<string, unknown>): string {
  const sp = new URLSearchParams()
  const add = (k: string, v: unknown) => {
    if (v != null && v !== '') sp.append(k, String(v))
  }
  // 'pageRequest.cursor' 같은 점 표기는 마지막 세그먼트만(flat) 사용
  const flatKey = (k: string) => (k.includes('.') ? k.slice(k.lastIndexOf('.') + 1) : k)
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach(v => add(flatKey(key), v))
    } else if (value && typeof value === 'object') {
      for (const [k2, v2] of Object.entries(value as Record<string, unknown>)) add(flatKey(k2), v2)
    } else {
      add(flatKey(key), value)
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
