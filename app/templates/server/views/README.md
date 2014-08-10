# ExpressJS Views

Recommended folder to organize your ExpressJS views.

By default, the stack uses [Handlebar.js](https://github.com/wycats/handlebars.js/) for its view templating needs.

## Default Structure

The ```views``` folder is organized the following way by default:

* [```layouts/```](layouts/): Handlebar.js layout templates folder
* [```partials/```](partials/): Handlebar.js partial templates folder
* [```about.hbs```](about.hbs): Generated template for About view (```/about```)
* [```home.hbs```](home.hbs): Generated template for Home view (```/```)


## Tips
If you choose to organize your ```view``` folder differently (and you may!), 
remember to reflect the changes in [```/server/config.js```](../config.js).

Affected config settings:

* ```config.dirs.views```

