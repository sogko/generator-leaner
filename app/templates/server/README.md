# ExpressJS Server

Recommended folder to organize your ExpressJS server and its components.

## Default Structure

The ```server``` folder contains the following default components:

* [```app.js```](app.js)
* [```config.js```](config.js)
* [```middlewares/```](middlewares/)
* [```models/```](models/)
* [```routes/```](routes/)
* [```views/```](views/)
    * [```layouts/```](views/layouts/)
    * [```partials/```](views/partials/)

## Tips
If you choose to organize your ```server``` folder differently (and you may!), 
remember to reflect the changes in [```config.js```](config.js).

Affected config settings:

* ```config.dirs.public```
* ```config.dirs.views```
* ```config.dirs.routes```
* ```config.handlebars.layoutsDir```
* ```config.handlebars.partialsDir```

