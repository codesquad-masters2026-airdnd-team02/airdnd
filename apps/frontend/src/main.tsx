import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
