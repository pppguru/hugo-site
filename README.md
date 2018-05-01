# Diffeo Website - 2

This repository contains the source code for Diffeo's new website. This website
is deployed on Netlify for development purposes:

https://diffeo-website-2.netlify.com/

## Project information

This repository is based off of the
[victor-hugo](https://github.com/netlify/victor-hugo) boilerplate project.
It uses [Hugo](https://gohugo.io/) as a static site generator and
[Gulp](https://gulpjs.com/) + [Webpack](https://webpack.js.org/) as your asset
pipeline.

It is setup to use [PostCSS](http://postcss.org/) and
[Babel](https://babeljs.io/) for CSS and JavaScript compiling/transpiling.

## Usage

### Prerequisites

You need to have the latest/LTS [node](https://nodejs.org/en/download/) and
[npm](https://www.npmjs.com/get-npm) versions installed in order to use Victor
Hugo, as well as [yarn](https://yarnpkg.com/en/docs/install).

Next step, clone this repository and run:

```bash
yarn install
```

This will take some time and will install all packages necessary to run Victor
Hugo and it's tasks.

### Development

While developing your website, use:

```bash
yarn start
```

or

```bash
gulp server
```

Then visit http://localhost:3000/ _- or a new browser windows popped-up already -_
to preview your new website. BrowserSync will automatically reload the CSS or
refresh the whole page, when stylesheets or content changes.

### Static build

To build a static version of the website inside the `/dist` folder, run:

```bash
yarn run build
```

To get a preview of posts or articles not yet published, run:

```bash
yarn run build-preview
```

See [package.json](package.json#L7) or the included gulp file for all tasks.

## Structure

```
|--site                // Everything in here will be built with hugo
|  |--content          // Pages and collections - ask if you need extra pages
|  |--data             // YAML data files with any data for use in examples
|  |--layouts          // This is where all templates go
|  |  |--partials      // This is where includes live
|  |  |--index.html    // The index page
|  |--static           // Files in here ends up in the public folder
|--src                 // Files that will pass through the asset pipeline
|  |--css              // CSS files in the root of this folder will end up in /css/...
|  |--js               // app.js will be compiled to /app.js with babel
```

## Basic Concepts

You can read more about Hugo's template language in their documentation here:

https://gohugo.io/templates/overview/

The most useful page there is the one about the available functions:

https://gohugo.io/templates/functions/

For assets that are completely static and don't need to go through the asset
pipeline, use the `site/static` folder. Images, font-files, etc, all go there.

Files in the static folder ends up in the web root. So a file called
`site/static/favicon.ico` will end up being available as `/favicon.ico` and so
on...

The `src/js/app.js` file is the entrypoint for webpack and will be built to
`/dist/app.js`.

You can use **ES6** and use both relative imports or import libraries from npm.

Any CSS file directly under the `src/css/` folder will get compiled with
[PostCSS Next](http://cssnext.io/) to `/dist/css/{filename}.css`. Import
statements will be resolved as part of the build

## Environment variables

To separate the development and production _- aka build -_ stages, all gulp
tasks run with a node environment variable named either `development` or
`production`.

You can access the environment variable inside the theme files with `getenv "NODE_ENV"`. See the following example for a conditional statement:

    {{ if eq (getenv "NODE_ENV") "development" }}You're in development!{{ end }}

All tasks starting with _build_ set the environment variable to `production` -
the other will set it to `development`.
