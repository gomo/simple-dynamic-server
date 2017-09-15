# simple-dynamic-server

## How to use

### start server

```
simple-dynamic-server
```

* DirectoryIndex is `index.html`
* Default port is 8888
* Default document root path is `./`

```
simple-dynamic-server -d foo/bar -p 8080
```

You can specify the document root dir by `d` option, also the port by `p` option.


### dynamic pages

If you want be `/dynamic/foo.html` page dynamic, make  `/dynamic/foo.html.js`.

/foo/bar.html.js

```js
module.exports = function(request, response){
  response.write('ccccc');
  response.end();
}
```