# aem-react-editable-components

Library that provides a mapping that associates a component class with a resource path

## Artifactory setup

- Generate / get API key
  - using adobenet credentials log in at https://artifactory.corp.adobe.com/artifactory/webapp/#/profile
  - authorize yourself once more if additional options are locked
  - in authentication settings section generate new API key (if it was not yet generated)
  - copy key to clipboard

- Generate registry information

```sh
$ scope=adobe
$ repository=cq-spa
$ user=username # use your adobenet login here!
$ key=$(pbpaste)
$ curl -u "$user:$key" "https://artifactory.corp.adobe.com/artifactory/api/npm/npm-${repository}-release/auth/${scope}"
```

You should get output similar to:

```
@adobe:registry=https://artifactory.corp.adobe.com:443/artifactory/api/npm/npm-cq-spa-release/
//artifactory.corp.adobe.com:443/artifactory/api/npm/npm-cq-spa-release/:_password=(...)
//artifactory.corp.adobe.com:443/artifactory/api/npm/npm-cq-spa-release/:username=(username)
//artifactory.corp.adobe.com:443/artifactory/api/npm/npm-cq-spa-release/:email=(username)@adobe.com
//aortifactory.corp.adobe.com:443/artifactory/api/npm/npm-cq-spa-release/:always-auth=true
```

If everything looks correct you should add given output to global npm configuration `~/.npmrc` (or to `.npmrc` in the root of the project)

```sh
$ curl -u "$user:$key" "https://artifactory.corp.adobe.com/artifactory/api/npm/npm-${repository}-release/auth/${scope}" >> ~/.npmrc
```

Note that `npm-cq-spa-release` is a virtual repository that aggregates both the local private repository `npm-cq-spa-release-local` and the npm public repository https://registry.npmjs.org (see https://www.npmjs.com/search?q=cq-spa)

## Development

Run npm install to get all node_modules that are necessary for development.

### Build

```sh
$ npm run build
```

or

```sh
$ npm run build:production
```

### Test

```sh
$ npm run test
```

or

```sh
$ npm run test-debug
```

### Generate docs

```sh
$ npm run docs
```

The documents will be generated in the /out folder

### Generate Changelog

```sh
$ auto-changelog
```
