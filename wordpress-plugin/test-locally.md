# 🧪 Bead Pattern Designer 로컬 테스트 가이드

## 방법 1: 간단한 HTML 테스트 (권장)

### 실행 방법
```bash
# 1. 테스트 디렉토리로 이동
cd wordpress-plugin

# 2. 간단한 HTTP 서버 실행 (Python 3)
python3 -m http.server 8000

# 또는 Node.js 사용
npx serve .

# 또는 PHP 사용
php -S localhost:8000
```

### 브라우저에서 접속
```
http://localhost:8000/test-environment.html
```

### 테스트 항목
- ✅ XSS 공격 차단 테스트
- ✅ CSP 헤더 검증
- ✅ Rate Limiting 시뮬레이션
- ✅ Nonce 토큰 검증
- ✅ JavaScript 난독화 확인
- ✅ CSS 인젝션 방지 테스트

---

## 방법 2: Docker로 실제 워드프레스 환경 테스트

### 1. Docker 설치 확인
```bash
docker --version
docker-compose --version
```

### 2. 워드프레스 컨테이너 시작
```bash
cd wordpress-plugin
docker-compose up -d
```

### 3. 워드프레스 접속
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081

### 4. 초기 설정
1. http://localhost:8080 접속
2. 워드프레스 설치 마법사 진행
3. 관리자 계정 생성

### 5. 플러그인 활성화
1. 워드프레스 관리자 로그인
2. 플러그인 → 설치된 플러그인
3. "Bead Pattern Designer" 활성화

### 6. 테스트
1. 페이지 → 새로 추가
2. 본문에 `[bead-pattern]` 입력
3. 게시 후 확인

### 7. 종료
```bash
docker-compose down
```

### 8. 데이터 완전 삭제 (선택사항)
```bash
docker-compose down -v
```

---

## 방법 3: 기존 워드프레스에 설치

### 1. 플러그인 압축
```bash
tar -czf bead-pattern-designer.tar.gz bead-pattern-designer/
```

### 2. 워드프레스 관리자
1. 플러그인 → 새로 추가 → 플러그인 업로드
2. tar.gz 파일 선택 (또는 압축 해제 후 ZIP으로 재압축)
3. 설치 및 활성화

---

## 보안 테스트 체크리스트

### JavaScript 콘솔에서 테스트
```javascript
// 1. XSS 테스트
document.querySelector('#bpd-test1').innerHTML = '<img src=x onerror="alert(1)">';
// → alert가 실행되지 않아야 함

// 2. Nonce 확인
console.log(window.bpdNonce);
// → 고유한 토큰이 출력되어야 함

// 3. 난독화 확인
console.log(BeadApp);
// → 난독화된 객체가 보여야 함

// 4. CSP 테스트
eval('alert("CSP Test")');
// → CSP가 엄격하면 차단됨
```

### 개발자 도구 네트워크 탭
1. bundle.js 파일 크기 확인 (~56KB)
2. bundle.css 파일 크기 확인 (~24KB)
3. 소스맵 없음 확인

### 보안 헤더 확인 (개발자 도구)
1. Network 탭 → test-environment.html 선택
2. Response Headers 확인
3. 보안 관련 헤더 존재 확인

---

## 문제 해결

### Docker 실행 오류
```bash
# 권한 문제
sudo docker-compose up -d

# 포트 충돌
# docker-compose.yml에서 포트 변경
# 8080 → 8082, 8081 → 8083 등
```

### 플러그인이 보이지 않을 때
1. 파일 권한 확인
```bash
chmod -R 755 bead-pattern-designer/
```

2. 플러그인 폴더 구조 확인
```
bead-pattern-designer/
├── bead-pattern-designer.php  # 필수!
├── assets/
│   ├── bundle.js
│   └── bundle.css
└── includes/
    └── security.php
```

### JavaScript 오류
1. 브라우저 콘솔 확인
2. bundle.js 파일 로드 확인
3. Svelte 앱 초기화 확인

---

## 성능 벤치마크

### 측정 항목
- 초기 로드 시간: < 500ms
- 인터랙티브 시간: < 1s
- 메모리 사용량: < 50MB
- CPU 사용률: < 10%

### 측정 도구
- Chrome DevTools → Performance
- Lighthouse (Chrome 확장)
- GTmetrix (온라인)