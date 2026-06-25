# 부하 테스트 (staged app 대상)

> ⚠️ 대상은 **staged app(`10.0.10.29:8080`)** — 라이브(`airdnd.wownd.me`)가 아니다.
> edge 박스에서 app 내부로 때리므로 라이브·동료 실험에 영향 없음.

## 빠른 수치 — hey (원라이너)

```bash
# 설치 (edge 박스, Go 바이너리)
curl -sL https://hey-release.s3.us-east-2.amazonaws.com/hey_linux_amd64 -o ~/hey && chmod +x ~/hey
# 동시 50, 총 3000 요청 → RPS, p50/p95/p99 출력
~/hey -n 3000 -c 50 http://10.0.10.29:8080/api/listings
```

## 시나리오 + 임계값 — k6

```bash
# docker 로 (설치 불필요)
docker run --rm -i --network host -e TARGET=http://10.0.10.29:8080 \
  grafana/k6 run - < listings.js
```

ramp-up(20)→유지(50)→ramp-down. 임계값: 에러율 <1%, p95 <500ms (PASS/FAIL 출력).

## 시각화

부하를 거는 동안 Grafana `airdnd — Overview` 대시보드에서
HTTP 요청률·p95/p99·JVM 힙·CPU·HikariCP 가 실시간으로 출렁이는 것을 본다.
(refresh 5s, time range now-15m)
