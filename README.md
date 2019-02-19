# netguru-recru-task

Simple REST API for Netguru as recruitment task.

## Requirements

Following stuff must be installed to make app working properly:

* [Node.js](http://nodejs.org) version 10.15.1

## Testing

App is using Jest test framework.

## Tasks

Task            | Description
-----           | -----------
`start`         | Alias of `serve` - you can simply use `npm start`
`build`         | Launches commands `build-ts` and `tslint`
`serve`         | `node dist/app.js`
`watch`         | Watches via nodemon `dist/app.js`
`test`          | Runs all tests in `tests` directory
`reformat`      | Runs prettier and tslint
`prettier`      | Runs prettier
`watch-test`    | Runs `test` with watcher
`build-ts`      | Builds JavaScript from TypeScript sources
`watch-ts`      | Runs `build-ts` with watcher
`tslint`        | Runs tslint to check styles
`dev`           | Runs `build` and `watch-debug` - development env task
`watch-serve`   | Runs `server` via nodemon
`watch-dev`     | Concurrently runs `watch-ts` and `serve-debug`

## Environmental variables list

Variable                | Description
-----                   | -----------
`DATABASE_ENGINE`       |  database engine (default: `mysql`)
`DATABASE_HOST`         |  database host (default: `127.0.0.1`)
`DATABASE_MAX_CONN`     |  database max connections (default: `25`)
`DATABASE_MAX_IDLE_MS`  |  database max idle time in ms (default: `30000`)
`DATABASE_MIN_CONN`     |  database min connections (default: `0`)
`DATABASE_NAME`         |  database name
`DATABASE_PASSWORD`     |  database password
`DATABASE_PORT`         |  database port
`DATABASE_USER`         |  database user
`PORT`                  |  app port (default: `3000`), you shouldn't change it!

## Run in production

In order to run in production, I suggest using docker. More info how to run it - look below. If you want to run it without docker I suggest taking a look at "Environmental variables list", setting then up to your needs and simply build it and start it:

```sh 
$ npm run build
$ npm start
```

## Run in production via Docker

You simply need to pull the image (it's available publicly on [dockerhub](https://cloud.docker.com/u/piotrmoszkowicz/repository/docker/piotrmoszkowicz/netguru)) and set up envs.
After setting up ENVs, proceed with commands:

```sh 
$ docker run -d -p 3306:3306 --name mysql mysql:5.7
$ docker run -d -p 3000:3000 --env-file ./config.env --name netguru piotrmoszkowicz/netguru
```

If you want to rebuild the image, feel free to do so via:

```sh
$ docker build . -t piotrmoszkowicz/netguru
```

## Develop

To run locally, first of all you need to add local-development.ts file in /config. Use development.ts file as a template for it. You need to fill out database credentials and stuff, after it you can run command below:

```sh 
$ npm run dev
```