# dudada


## backend

simple express server on node js


## frontend

non secured vue js app


## persistence

backend stores user and state in a local json file to prevent reconfiguration or loss of state during restart. no tracking!!!

## development

1. run `node server.js` to start backend on 5000
1. in client folder `npm run dev` to use vite frontend server with proxy to backend

## prod

1. run `./publish.sh`
1. run `node server.js` from **dist**
