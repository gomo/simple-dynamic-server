#!/usr/bin/env node

var http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs");

var argv = require('optimist')
  .default({ d : './', p : 8888 })
  .argv
  ;



function send(path, response){
  response.end();
  console.log(new Date().toLocaleString() + " " + path + " " + response.statusCode)
}

function responseError(error, path, header, response){
  header["Content-Type"] = "text/plain";
  response.writeHead(500, header);
  response.write(
    error.stack
  );
  send(path, response)
}

targetDir = path.join(process.cwd(), argv.d)
 
http.createServer(function(request, response) {
  var header = {
    "Access-Control-Allow-Origin":"*",
    "Pragma": "no-cache",
    "Cache-Control" : "no-cache"	   
  }

  var urlPath = url.parse(request.url).pathname;
  if(urlPath.endsWith('/')){
    urlPath = urlPath + 'index.html'
  }
  var filename = path.join(targetDir, urlPath);

  fs.readFile(filename, function(err, data){
    if(!err){
      response.writeHead(200, header);
      response.write(data, "binary");
      send(urlPath, response)
    } else {
      filename = filename + '.js'
      var func;
      try {
        delete require.cache[filename]
        func = require(filename);
        console.log(new Date().toLocaleString() + " " + path + " with " + filename)
      } catch (e) {
        if (e instanceof Error && e.code === "MODULE_NOT_FOUND"){
          header["Content-Type"] = "text/plain";
          response.writeHead(404, header);
          response.write("404 Not Found\n");
          send(urlPath, response)
        } else {
          responseError(e, urlPath, header, response)
        }
      }

      if(!response.finished){
        if(func){
          try{
            func(request, response)
          } catch (e) {
            responseError(e, urlPath, header, response)
          }
        } else {
          header["Content-Type"] = "text/plain";
          response.writeHead(404, header);
          response.write("Missing function in " + filename);
          send(urlPath, response)
        }
      }
    }
  })
}).listen(parseInt(argv.p, 10));

console.log(new Date().toLocaleString() + " Server running at http://localhost:" + argv.p + " in " + targetDir);