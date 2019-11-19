const http = require('http'); 
const app = require('./app'); //import app from app.js

const port = process.env.PORT || 3000;

//we need to pass a listener here,  this is a function which is
//executed when ever we got a new request and is responsible for
//returning the response
const server = http.createServer(app); //now express app qualifies as a request handler

//starting the server
server.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
