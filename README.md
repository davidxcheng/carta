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
watchify main.js -o ../bundle.js -v --debug
```

## Current State (Moi Jouni:-)
You can create nodes. And delete nodes! You can also move them around and edit the title.
That is all. I'm working on drawing lines between the nodes.