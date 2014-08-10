# ExpressJS Views

Recommended folder to organize your ExpressJS views.

By default, the stack uses handlebar.js for our templating needs

The ```views``` folder is organized the following way by default:


````
...
'-> views/              // root views folder
  '-> layouts/          // template layouts folder
  '-> partials/         // template partials folder
  ...
  '-> about.hbs         // default About view (/about) 
  '-> home.hbs          // default Home view (/) 

````

By default, ```config.dirs.views``` was set to this current directory.

Remember to reflect ```/server/config.js``` if you'd like to organize it differently.