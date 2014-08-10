# Client

Recommended folder to organize your client-side files and applications

## Default Structure

The ```client``` folder contains the following default components:

* [```main.js```](main.js)
* [```apps/```](apps/)
* [```assets/```](assets/)
    * [```css/```](assets/css/)
    * [```js/```](assets/js/)
        * [```lib/```](assets/js/lib/)
        * [```vendor/```](assets/js/vendor/)


### Overview
The stack uses [RequireJS](http://requirejs.org) as a modular script loader for its client-side needs.

This brings us two main benefits:

#### 1. A clean and simple modular script loader
* Just one ```<script>``` tag in your HTML body to kick start your client scripts.
* No more losing track of which JavaScript needs to be loaded and in which order.
* No more constantly messing around with the server-side layout template to add a ```<script>``` tag for every
new JavaScript file component that you need.
* When you are working on writing client-side applications, you would want to stay within ```/client``` context and minimize switching context to ```/server``` and mess around with server-side components.

#### 2. Leverage on Asynchronous Module Definition (AMD) 
* Bringing over good coding practice from your server-side codebase by making your client codebase modular as well.
* Read more about [the benefits of AMD](http://requirejs.org/docs/whyamd.html)

### main.js
This the main loader for your client-side scripts and applications.

By default, this file is loaded from [```/server/views/layouts/main.hbs```](../server/views/layouts/main.hbs)

This file contains RequireJS configuration options for your main loader. This is also where you can define your JavaScript library dependencies and your Angular apps here.

Read more about [RequireJS configuration options](http://requirejs.org/docs/api.html#config)


## Tips
If you choose to organize your ```client``` folder differently (and you may!), 
remember to reflect the changes in [```/server/config.js```](../server/config.js).

Affected config settings:

* ```config.dirs.public```

