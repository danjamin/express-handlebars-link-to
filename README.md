# express-handlebars-link-to

Link-to for handlebars templates in Express JS applications.

Inspired by Ember JS's [link-to](http://emberjs.com/guides/templates/links/) handlebars helper.


## Installation

```sh
npm install --save https://github.com/danjamin/express-handlebars-link-to/tarball/v0.1.0
```

## Example usage

In your express app:

```js
// index.js

var express = require('express')
var app = express()

var router = require('express-handlebars-link-to')

// Be sure to register the helper with handlebars
// ...
  helpers:  {
    'link-to': router.LinkToHelper
  }
// ...

// Save the current URL in the Router!
app.use(router.RouterMiddleware())

// [Optionally] log the registered routes on startup
router.Router.logAllDefinedRoutes()
```

In a given controller:
```js
// controllers/IndexController.js

// Require the Router model in order to register/define your routes
var router = require('express-handlebars-link-to').Router

module.exports = function (app) {
  // Define a route with name "index" and route "/main/:username"
  // The route is returned by default,
  // therefore index === "/main/:username" is true
  var index = router.define('index', '/main/:username')

  // Then pass the route as "normal" to express
  app.get(index, function (req, res) {
    // Render the index handlebars template
    res.render('index', {})
  })
}
```

In a given template:

```hbs
{{!--  views/sign-in.hbs --}}

{{#link-to 'index'}}Index{{/link-to}}
```

You can optionally pass in attributes like class, rel, etc.

The parameters after the route name get passed to the route.  For example
if you had the route `router.define('person', '/people/:id')` you might use it as
follows:

```hbs
{{#link-to 'person' person.id class="cool-stuff" rel="nofollow"}}
  Person {{person.name}}
{{/link-to}}
```
