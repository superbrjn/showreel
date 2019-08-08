server in package.json
(instead of primary "main": "app.js")
added "start": "node app"

server in app.js
from app.use(express.static(path.join(__dirname, 'public')));
to app.use(express.static(path.join(__dirname, '../client/public')));

----

client in .angular-cli.json
from outDir: dist
to outDir: public


######
------

Read for help:

1 https://www.youtube.com/watch?v=XiLKTVNI998&index=3&list=PL3vQyqzqjZ637sWpKvniMCxdqZhnMJC1d
2 https://github.com/shravass/cs5610-summer-2017-webDev-shravanthi/blob/master/project/services/recipe.service.server.js
3 https://www.youtube.com/watch?v=p1b6weVd87Y&index=55&list=PL_GGiAMracOXEpxjhLR9Kbd5ZS8Ob6buZ
4 https://github.com/MrCalico/twit-ng/tree/master/src/app
5 https://scotch.io/tutorials/file-uploads-in-angular-with-a-node-and-hapi-backend
6 https://scotch.io/tutorials/angular-file-uploads-with-an-express-backend
https://www.youtube.com/user/jannunzi/playlists
7 https://github.com/scotch-io/node-api-course
