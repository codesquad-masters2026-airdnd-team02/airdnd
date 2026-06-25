// k6 부하 스크립트 — staged app(private) 대상
// 실행(edge 박스에서, app 내부로): TARGET 미지정 시 기본 = app 내부 주소
//   docker run --rm -i --network host -e TARGET=http://10.0.10.29:8080 grafana/k6 run - < listings.js
// 또는 k6 설치 후:  TARGET=http://10.0.10.29:8080 k6 run listings.js
//
// ⚠️ 라이브(airdnd.wownd.me)가 아니라 staged app 을 때린다 → 라이브·동료 무영향.
import http from "k6/http";
import { check, sleep } from "k6";

const TARGET = __ENV.TARGET || "http://10.0.10.29:8080";

export const options = {
  stages: [
    { duration: "30s", target: 20 },  // ramp-up
    { duration: "1m", target: 50 },   // 부하 유지
    { duration: "30s", target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],          // 에러율 1% 미만
    http_req_duration: ["p(95)<500"],        // p95 < 500ms
  },
};

export default function () {
  const res = http.get(`${TARGET}/api/listings`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
