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


// Render root page
app.get('/', function(req, res, next) {
    res.render('home');
});



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

app.get('/devices', function(req, res) {
    selectTableData(res, 'Device');
});



app.post('/search_mac', function(req, res) {
    var context = {};
    var body = req.body;
    var queryStr = 'SELECT * FROM Device WHERE Device.MACAddress=' + body.MAC + ';';
  
    console.log('Performing query: ' + queryStr);
    pool.query(queryStr, function(err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        context.results = rows;
        console.log('   Result: ' + context.results);
        res.render(context);
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
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
