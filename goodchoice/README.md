# Review Reply Generator

## 개요
Review Reply Generator는 고객 리뷰에 대한 답변을 자동으로 생성하는 크롬 익스텐션입니다. 이 익스텐션은 "댓글등록" 버튼 아래에 "답변생성" 버튼을 추가하고, OpenAI API를 사용하여 고객 리뷰에 대한 답변을 생성합니다.

## 기능
- "댓글등록" 버튼 아래에 "답변생성" 버튼 추가
- OpenAI API를 사용하여 고객 리뷰에 대한 답변 생성
- 생성된 답변을 textarea에 자동으로 입력
- 크롬 브라우저를 열고 chrome://extensions/로 이동합니다.
- 우측 상단의 "개발자 모드"를 활성화합니다.
- "압축해제된 확장 프로그램 로드" 버튼을 클릭하고, 다운로드한 폴더를 선택합니다.

## 사용 방법
- "리얼 리뷰" -> "미답변 리뷰"에서만 작동합니다. 
- 익스텐션을 설치한 후, https://ad.goodchoice.kr/manage-accommodation/review/unanswered/1 페이지로 이동합니다.
- "댓글등록" 버튼 아래에 "답변생성" 버튼이 추가된 것을 확인합니다.
- "답변생성" 버튼을 클릭하여 OpenAI API를 통해 생성된 답변을 textarea에 자동으로 입력합니다.

## 설정
- 익스텐션 아이콘을 클릭하여 팝업을 엽니다.
- OpenAI API 키를 입력하고 저장합니다.

## 기여 방법
- 이 저장소를 포크합니다.
- 새로운 브랜치를 생성합니다.
    ``` bash
    git checkout -b feature/새로운기능
    ```
- 변경 사항을 커밋합니다.
    ``` bash
    git commit -m 'Add 새로운 기능'
    ```
- 브랜치에 푸시합니다.
    ``` bash
    git push origin feature/새로운기능
    ```
- Pull Request를 생성합니다.

### 라이센스
- 이 프로젝트는 Apache License 2.0에 따라 라이센스가 부여됩니다.