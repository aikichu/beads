# Bead Pattern Designer 워드프레스 플러그인 설치 가이드

## 설치 방법

### 1. 플러그인 파일 준비
```bash
# 이미 완료된 상태입니다
wordpress-plugin/bead-pattern-designer/
├── bead-pattern-designer.php  # 메인 플러그인 파일
├── readme.txt                  # 워드프레스 플러그인 정보
├── index.php                   # 보안 파일
└── assets/
    ├── bundle.js               # 난독화된 JavaScript
    ├── bundle.css              # 스타일시트
    └── index.php               # 보안 파일
```

### 2. 워드프레스에 업로드

#### 방법 A: FTP 사용
1. FTP로 워드프레스 서버 접속
2. `/wp-content/plugins/` 디렉토리로 이동
3. `bead-pattern-designer` 폴더 전체를 업로드

#### 방법 B: ZIP 파일로 설치
1. `bead-pattern-designer` 폴더를 ZIP으로 압축
2. 워드프레스 관리자 > 플러그인 > 새로 추가
3. "플러그인 업로드" 클릭
4. ZIP 파일 선택 후 설치

### 3. 플러그인 활성화
1. 워드프레스 관리자 > 플러그인
2. "Bead Pattern Designer" 찾기
3. "활성화" 클릭

## 사용 방법

### 페이지/포스트에 추가
```
[bead-pattern]
```

### 옵션 사용
```
[bead-pattern width="100%" height="600px"]
[bead-pattern class="my-custom-style"]
```

### 관리자 메뉴
- 워드프레스 관리자 > Bead Pattern 메뉴에서 테스트 가능

## 보안 강화 완료 사항

✅ **코드 난독화**
- Terser로 JavaScript 최소화
- console.log 제거
- 프로퍼티 난독화
- 주석 제거
- 소스맵 제거 (프로덕션)

✅ **디렉토리 보호**
- index.php 파일로 직접 접근 차단

✅ **플러그인 보안**
- ABSPATH 체크
- Nonce 검증 준비
- 이스케이프 함수 사용

## 업데이트 방법

1. 소스 코드 수정 후:
```bash
npm run build
```

2. 새 빌드 파일을 플러그인 디렉토리에 복사:
```bash
cp public/build/bundle.* wordpress-plugin/bead-pattern-designer/assets/
```

3. 워드프레스 서버에 업로드

## 문제 해결

### 플러그인이 작동하지 않을 때
1. 브라우저 개발자 도구에서 콘솔 에러 확인
2. 워드프레스 디버그 모드 활성화
3. PHP 버전 확인 (7.2 이상 필요)

### 스타일이 깨질 때
1. 테마와의 CSS 충돌 확인
2. 커스텀 클래스로 스타일 격리