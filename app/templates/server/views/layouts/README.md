# HandlebarsJS Layout Templates

Recommended folder to organize your Handlebar.js layout templates.

By default, the stack generates a default layout template [```main.hbs```](./main.hbs).

## Tips

### Creating / editing a layout template
If you plan to continue on using RequireJS to leverage on its power of loading scripts, 
ensure that you include the 
```<script>``` tag before ```{{{body}}}```

```
...
    <script src="/assets/js/vendor/requirejs/require.js" data-main="/main.js"></script>
    {{{body}}}

```

The above HTML/template snippet will load RequireJS and instructs it to load the main entry-point script for our client application(s).
The main script can be found in (```/client/main.js```)[../../../client/main.js]


### Choosing a different folder organization
If you choose to organize your ```layouts``` folder differently (and you may!), 
remember to reflect the changes in [```/server/config.js```](../../config.js).

Affected config settings:

* ```config.handlebars.layoutDirs```
