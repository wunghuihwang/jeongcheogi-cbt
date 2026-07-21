# 정처기 CBT

제공된 2022~2025년 정보처리기사 필기 기출 12회분을 구조화한 모바일 우선 CBT/PWA입니다. 화면과 공개 문제 API에는 교정된 `questionText`·`normalized` 선택지와 오프라인 채점용 필드만 노출하며, 원문 보존 필드는 서버 데이터에만 남깁니다. 학습 기록·오답·즐겨찾기는 기기에 저장되고, 설치 후에는 문항·정답·도형을 캐시하여 오프라인에서도 채점할 수 있습니다.

## 실행

```bash
pnpm install
pnpm extract:exams
pnpm audit:exams
pnpm validate:exams
pnpm dev
```

같은 Wi-Fi의 휴대폰에서 컴퓨터의 LAN IP와 `:3000`으로 접속하면 즉시 화면을 확인할 수 있습니다. 예: `http://192.168.0.14:3000`.

서비스 워커를 포함한 완전한 PWA 설치·오프라인 동작은 브라우저 보안 정책상 신뢰되는 HTTPS 주소(또는 같은 기기의 localhost)에서만 활성화됩니다. HTTPS로 배포한 뒤 iOS는 Safari 공유 메뉴의 “홈 화면에 추가”, Android는 Chrome의 “앱 설치”를 사용합니다. LAN의 HTTP 주소에서 추가한 아이콘은 오프라인 PWA가 아니라 바로가기로 동작할 수 있습니다.

## 배포

- 프로덕션: [https://jeongcheogi-cbt.vercel.app](https://jeongcheogi-cbt.vercel.app)
- 수동 배포: `npx vercel@latest --prod --archive=tgz`
- `.vercelignore`를 통해 원본 PDF, 작업 지침, 테스트와 보고서는 업로드에서 제외합니다.
- GitHub 자동 배포는 연결하지 않으며 필요할 때 CLI로 배포합니다.

## 데이터 명령

- `pnpm extract:exams`: PDF 텍스트 레이어와 이미지 참조를 분석해 `data/imported` JSON 생성
- `pnpm audit:exams`: OCR 잔재, 코드·SQL 분류, 전체 페이지 이미지, 누락 자산 검사
- `pnpm validate:exams`: 12회/100문항/선택지/정답/해시 검증
- `pnpm report:exams`: 회차별 검증 표 출력
- `pnpm generate:pwa-icons`: 설치용 PNG 및 Apple Touch 아이콘 재생성
- `pnpm import:exams`: 비공개 Storage와 Supabase DB에 멱등 적재

Supabase 사용 시 [.env.example](./.env.example) 값을 채우고 [마이그레이션](./supabase/migrations/202607210001_initial.sql)을 적용합니다. 원본 PDF, 문제 자산, 출제기준 버킷은 모두 비공개입니다.
