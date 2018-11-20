var express = require('express');
var bodyParser = require('body-parser');// npm install body-parser --local
var fs = require("fs");
var path = require('path');
var serveStatic = require('serve-static');
var cors = require('cors');
var moment = require('moment');
var os = require('os');

var app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//allow access to the files under the ajax directory to be addressed via the uri localhost:8080\static\<file>
//app.use('static', express.static('C:\\SoftwareDevelopment\\ITS562\\github\\ITS562\\ajax\\'));
app.use( express.static('./'));

var userdata = null;

var randomScalingFactor = function() {
    return Math.round(Math.random() * 100);
};

////app.use(bodyParser.json);
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//var multer = require('multer'); // v1.0.5
//var upload = multer(); // for parsing multipart/form-data


//http://localhost:8081/listUsers
app.get('/listUsers', function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log(data);
       
        res.end(data);
    });
})

//http://localhost:8081/listUsers
app.get('/randomcard', function (req, res) {
    var card = "images/" + Math.floor(1 + (Math.random() * 7)).toString() + "_S.png";
    res.send(card);
});

function newDate(days, minutes) {
    let now =  moment();
    now.add(days, 'd');
    if(minutes){
        now.add(minutes, 'm')
    
    }
    return now.toDate();
}

function newDateString(days, minutes) {
    let now =  moment();
    now.add(days, 'd');
    if(minutes){
        now.add(minutes, 'm')
    
    }
    return now.format();

    
}

//http://localhost:8080/listUsers
app.get('/linedata', function (req, res) {
    let data =[];

    for(i = 0; i < 25; i++){
        let datapoint = {
            x:newDateString(0, i*30),
            y: randomScalingFactor()
        }
        data.push(datapoint);
    }
  
    res.end(JSON.stringify(data));

});

var MemoryHistory ={
    "freemem" :  [os.freemem()],
    "uptime" : [os.uptime()],
    "snapshot" : [newDateString(0,0)]
};


//http://localhost:8080/listUsers
app.get('/osinfo', function (req, res) {
    let data =[];
    let freemem = os.freemem();
    let totalmem = os.totalmem();
    let date = newDateString(0,0);
    MemoryHistory.freemem.push(os.freemem());
    MemoryHistory.uptime.push(os.uptime());
    MemoryHistory.snapshot.push(date);
    
  
    res.end(JSON.stringify(MemoryHistory));

});


//http://127.0.0.1:8081/id/2 
app.get('/id/:id', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        var user = users["user" + req.params.id]
        console.log(user);
        res.end(JSON.stringify(user));
    });
});

//http://127.0.0.1:8080/id/2
app.delete('/id/:id', function(req,res){
    let request = "DELETE USER " + req.params.id;
    console.log(request);

});

app.get('/randomcardImage', function (req, res) {
    var card = Math.floor(1 + (Math.random() * 52)).toString() + ".png";
    console.log(card);
    //console.log();
    console.log(__dirname);
    var fileCard = "~/../Poker/images/" + card;
    console.log(fileCard);
    fs.readFile(fileCard, function (err, data) {
        if (err) {
            res.send(err);
            //thow err;
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><body><img src="data:image/jpeg;base64,')
            res.write(Buffer.from(data).toString('base64'));
            res.end('"/></body></html>');
        }
    });

});
//Must use Fiddler here... Post to //http://localhost:8081/addUser
app.post('/addUser', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        var body = req.body;
        var keys = Object.keys(body);
        var idString = keys[0];
        // body = JSON.parse( body );
        data[idString] = body[idString];
        console.log(data);
        res.end(JSON.stringify(data));
    });
});

//http://127.0.0.1:8081/2 
app.get('/id/:id', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        var user = users["user" + req.params.id]
        console.log(user);
        res.end(JSON.stringify(user));
    });
});

// app.post('/user', function(req, res){

// });


app.delete('/deleteUser', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        delete data["user" + 2];

        console.log(data);
        res.end(JSON.stringify(data));
    });
});

var server = app.listen(8080, "127.0.0.1", function () {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        userdata = JSON.parse(data);
        console.log(data);
        var serverAddress = server.address();
        var host = serverAddress.address;
         var port = server.address().port;

         console.log("Example app listening at http://%s:%s", host, port);
    });
    

})