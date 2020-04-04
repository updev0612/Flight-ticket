//module import
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://localhost:27017/myflightdb";
var dtextract = require('./data_extract');
var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get('/index.html', function (req, res) {
    var q = url.parse(req.url, true);
    var qq = url.parse(req.url, true).query;

    // Main page showing part
    if(!qq.name){
      res.sendFile( __dirname + "/" + "index.html" );
    }

    // Data search
    else if(qq.name == "aa")
    {
        dtextract.mydata_extract(qq.queryurl+"&quoteKey="+qq.quoteKey);
        res.end();
    }

    // Data open from MongoDB and sending to front-end
    else if(qq.name == "bb"){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db("myflightdb");
            var query = { name: "FlyTickets" };
            dbo.collection("tickets").find(query).toArray(function(err, result) {
                if (err) throw err;
                if(result.length == 0){
                    res.end(JSON.stringify("noresult"));
                }
                else{
                    res.end(JSON.stringify(result));
                }
            });
            db.close();
        });
    }
});

// Server constructing...
var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
});
