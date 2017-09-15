# simple-dynamic-server

## How to use

### install 

Install to global

```
npm install -g simple-dynamic-server
```

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

For example, it is useful when you want to change the response slightly by URL query. If you want be `/dynamic/foo.html` page dynamic, make  `/dynamic/foo.html.js`.

/dynamic/foo.html.js

```js
module.exports = function(request, response){
  var requestUrl = url.parse(request.url, true);
  var page = parseInt(requestUrl.query.page, 10)

  var resp = {
    items: [
      {
        id: 1234
        ...
      }
      ...
    ],
    paging: {
      "page": page,
      "pageCount": 10,
      "hasNext": page < 10,
      "hasPrev": page > 1,
      "perPage": 20
    } 
  }

  //Fixed ID not to be duplicated.
  for (var index = 0; index < resp.items.length; index++) {
    var element = resp.items[index];
    element.id = page.toString() + element.id
    resp.items[index]  = element
  }

  response.write(JSON.stringify(resp));
  response.end();
}
```
