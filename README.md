#carta
Trying out svg.

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
watchify main.js -o ../bundle.js -v
```