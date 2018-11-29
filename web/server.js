var mysql = require('mysql');
var request = require('request');
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 54546);
var portString = String( app.get('port') );

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_schmidtm',
    password: '_Magin0t Lin3_',
    database: 'cs340_schmidtm'
});



// END OF REQUIRE-ABLES


var selectTableData = function(res, table) {
  var context = {};
  pool.query('SELECT * FROM ' + table, function(err, rows, fields) {
      if (err) {
          console.log(err);
          return;
      }
      context.results = rows;
      res.send(context);
  });
};

getDevice = function(res, context, MACAddress, complete) {
    var queryStr = 'SELECT MACAddress, description, type FROM Device WHERE MACAddress=?';
    var inserts = [MACAddress];

    pool.query(queryStr, inserts, function(err, rows, fields) {
        if (err) {
            res.write(JSON.stringify(err));
            console.log(err);
            res.end();
        }
        context.device = rows[0];
        complete();
    });
}


// Render root page
app.get('/', function(req, res, next) {
    var callbackCount = 0;
    res.render('home');
});

app.get('/devices', function(req, res) {
    selectTableData(res, 'Device');
});

// Get a single device and render update page
/*
app.get('/:MACAddress', function(req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateDevice.js"];
    
    getDevice(res, context, req.params.MACAddress, complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 2) {
            res.render('update', context);
        }
    }
})
*/

// Render registration page
app.get('/register', function(req, res, next) {
    res.render('register');
});


app.post('/add', function(req, res) {
    var context = {};
    var body = req.body;
    var queryStr = 'INSERT INTO Device (MACAddress, description, type) VALUES (?, ?, ?);';
    var inserts = [body.MACAddress, body.description, body.type];

    console.log('Performing query: ' + queryStr + ' - inserting - ' + inserts);
    pool.query(queryStr, inserts, function(err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        context.results = rows;
        //res.send(context);
        res.render('home');
    });
});

app.delete('/delete', function(req, res) {
    var context = {};
    var body = req.body;
    var queryStr = 'DELETE FROM Device WHERE Device.MACAddress="' + body.MACAddress + '";';

    console.log('Performing query: ' + queryStr);
    pool.query(queryStr, function(err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        context.results = rows;
        res.send(context);
    });
});

// Search functionality

app.post('/search_mac', function(req, res) {
    var context = {};
    var body = req.body;
    var queryStr = 'SELECT * FROM Device WHERE Device.MACAddress="' + body.MAC + '";';
  
    console.log('Performing query: ' + queryStr);
    pool.query(queryStr, function(err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        context.results = rows;
        res.send(context);
    });
});

// Update functionality

app.put('/update', function(req, res) {
    var context = {};
    var body = req.body;
    var queryStr = 'UPDATE Device SET MACAddress=?, username=?, description=?, type=?, IPAddress=? WHERE Device.MACAddress=?';
    var inserts = [body.newMACAddress, body.username, body.description, body.type, body.IPAddress, body.MACAddress];

    console.log('Performing query: ' + queryStr);
    pool.query(queryStr, inserts, function(err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        context.results = rows;
        res.send(context);
    });
});

// ERRORS

app.use(function(req, res){
    res.status(404);
    res.render('404');
});



app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});



app.listen(app.get('port'), function() {
    console.log('Express started on ' + app.get('port') + '; press Ctrl-C to terminate.');
});
