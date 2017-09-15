var http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs"),
targetDir = process.argv[2] || './',
port = process.argv[3] || 8888;



function send(path, response){
  response.end();
  console.log(new Date().toLocaleString() + " " + path + " " + response.statusCode)
}

targetDir = path.join(process.cwd(), targetDir)
 
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
          throw e;
        }
      }

      if(!response.finished){
        if(func){
          func.process(request, response)
        } else {
          header["Content-Type"] = "text/plain";
          response.writeHead(404, header);
          response.write("Missing function in " + filename);
          send(urlPath, response)
        }
      }
    }
  })
}).listen(parseInt(port, 10));

console.log(new Date().toLocaleString() + " Server running at http://localhost:" + port + " in " + targetDir);