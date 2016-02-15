#Carta
Playing with `svg` and trying to build a simple web version of Visio. 

## Starting the server
```
nodemon --harmony .
```

## Build client-side script
```
make --directory=public/js/src all
```
or:
```
cd public/js/src
watchify main.js -o ../bundle.js -v --debug
```

## Current State
You can create nodes. And delete nodes! You can also move them around and edit the title.
That is all.
