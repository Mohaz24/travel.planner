let projectData = {};

var path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();



/* Middleware */
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function(req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('dist/index.html'))
})


//POST route
app.post('/postData', postData)

function postData(req, res) {
    console.log(req.body);
    projectData = req.body;
    res.send(projectData);
};

// GET route
app.get('/getData', getData)

function getData(req, res) {
    res.send(projectData);
    console.log(projectData);
};

// Setting up server
const port = 8081;
const server = app.listen(port, listening)
// console.log(server)
function listening() {
    console.log('Server is running');
    console.log(`running on localhost: ${port}`)
}

