const express = require('express');
const app = express();
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Assignment");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
	    // Website you wish to allow to connect
	if(req.headers.origin) {
	   	res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
	    }
	    next();
    });

app.get('/', (req, res) => {
	res.send("Hello World!");
})

app.get('/users', (req, res) => {
	dbo.collection("Users").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    console.log(result);
	    var myjson=JSON.stringify(result);
	    res.send(myjson);
	});
});


app.get('/city', (req, res) => {
  	dbo.collection("City").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    console.log(result);
	    var myjson2=JSON.stringify(result);
	    res.send(myjson2);
	});
});

app.get('/states', (req, res) => {
  	dbo.collection("State").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    console.log(result);
	    var myjson1=JSON.stringify(result);
	    res.send(myjson1);
	});
});



app.get('/count', (req, res) => {
	//console.log("req.query", req);

  	console.log("req.body", res);
  dbo.collection("Users").find().limit(3).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    var myjson3=JSON.stringify(result);
	    res.send(myjson3);
  });
});


app.post('/cityselect',(req,res)=>
{
	dbo.collection("Users").find({city:"Uran"}).toArray(function(err,result){
		if(err) throw err;
		console.log(result);
		var myjson4=JSON.stringify(result);
	    res.send(myjson4);
  });
});



app.post('/insert', function (req, res) {
    // for safety reasons
        dbo.collection('Users').insertOne(req.body);
      
    //res.send('Data received:\n' + JSON.stringify(req.body));
});


  app.listen(3000, () => console.log('Example app listening on port 3000!'))
});
