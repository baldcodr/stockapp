const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

//use body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

//Create call API function
function call_api(apiFINISHED){
    request('https://cloud.iexapis.com/stable/stock/amzn/quote?token=pk_1623b44122704dd3aa29144bc5ed869d', {json: true}, (err, res, body) => {
    if (err) {return console.log(err);}
    if (res.statusCode === 200){
        //console.log(body);
        apiFINISHED(body);
    };
});
};//End of call-api function


//Create call API function for form POST
function api_call(apiFINISH, ticker){
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_1623b44122704dd3aa29144bc5ed869d', {json: true}, (err, res, body) => {
    if (err) {return console.log(err);}
    if (res.statusCode === 200){
        //console.log(body);
        apiFINISH(body);
    };
});
};//End of call-api function


//Set handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Set handlebars route home
app.get('/', function (req, res) {
    call_api(function(apiLOADED){
            res.render('home',{
            stock: apiLOADED
        });
    });
});


//Set handlebars stock-details POST route
app.post('/stock-details', function (req, res) {
    api_call(function(apiLOAD){
           // postItem = req.body.stock_ticker;
            res.render('stock-details',{
            stock: apiLOAD,
        });
    }, req.body.stock_ticker);
});


//Set handlebars route about
app.get('/about', function (req, res) {
    res.render('about');
});

//Set handlebars route all-stocks
app.get('/all-stocks', function (req, res) {
    call_api(function(apiLOADED){
        res.render('all-stocks',{
        stock: apiLOADED
        });
    });
});

//Set handlebars route stock-details
app.get('/stock-details', function (req, res) {
    call_api(function(apiLOADED){
            res.render('stock-details', {
            stock: apiLOADED
        });
    });
});

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => console.log('Server listening on port ' + PORT));
