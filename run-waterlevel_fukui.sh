while true
do
  deno run -A makeData.js
  git add data/
  git commit -m "update"
  git push
  sleep 60
done

