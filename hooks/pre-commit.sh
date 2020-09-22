
#!/bin/sh
# Adapted from: https://prettier.io/docs/en/precommit.html#option-6-shell-script
FILES=$(git diff --cached --name-only --diff-filter=ACMR "*.js" "*.jsx" "*.ts" "*.tsx" "*.json" "*.css" "*.scss" | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

cmd="yarn run prettier $FILES"
docker-compose exec -T server $cmd && echo "\nPrettier formatting is complete.\n" || { echo "\nPrettier formatting failed - is your docker container up and running?\n"; exit 1; }

echo "$FILES" | xargs git add

exit 0
