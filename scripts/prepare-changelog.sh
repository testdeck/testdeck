#!/bin/bash

npm run changelog | grep -v "^>" > CHANGELOG.add.md
cat CHANGELOG.add.md CHANGELOG.md > CHANGELOG.new.md.tmp
lines=$(cat CHANGELOG.new.md.tmp | wc -l)
tail -n $(expr $lines - 2) CHANGELOG.new.md.tmp > CHANGELOG.new.md
rm CHANGELOG.add.md CHANGELOG.new.md.tmp

