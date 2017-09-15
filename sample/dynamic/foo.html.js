module.exports = function(request, response){
  throw Error(hohohoh);
  response.write('hello dynamic !!!!');
  response.end();
}