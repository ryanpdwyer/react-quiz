#!/bin/zsh
fname=`print *(.om[1])`
npx babel -d _site/js js --watch --source-maps &
BABEL_PID=$!
echo "Babel process: $BABEL_PID"
npx eleventy --serve &
NPX_PID=$!
echo "eleventy process: $NPX_PID"
npx nodemon -w js/Quest4ionLim.js --exec "npx jsdoc -c jsdoc.json js/QuestionLim.js -t ./node_modules/better-docs" &
NODEMON_PID=$!
echo "nodemon process: $NODEMON_PID"
cntr_c() {
    kill $NPX_PID
    kill $BABEL_PID
    kill $NODEMON_PID
    exit
}
trap cntr_c INT
# path="/${fname%.*}/"
# if [ "$path" = "/index/" ]
# then
#     path="/"
# fi
sleep 5 && open "http://localhost:8080/${fname%.*}/"
while :
do
    sleep 1000000
done 