# PR 생성 - OMS Frontend

## 입력

$ARGUMENTS

## 절차

1. `docs/pr-template.md`를 읽어 PR 형식과 작성 가이드를 파악합니다.
2. `git log origin/main..HEAD --oneline`과 `git diff origin/main..HEAD`로 변경사항을 분석합니다.
3. 템플릿의 각 항목을 변경사항에 맞게 채워 PR 본문을 작성합니다.
4. 작성한 내용을 사용자에게 보여주고 수정 여부를 확인합니다.
5. `git push -u origin $(git branch --show-current)`로 브랜치를 push합니다.
6. `gh pr create --title "[OMS] <제목>" --base main --body "<PR 본문>"`으로 PR을 생성하고 URL을 출력합니다.
