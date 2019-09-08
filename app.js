const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');

const PORT = process.env.PORT || 5000;

//Create call API function
function call_api(apiFINISHED){
    request('https://cloud.iexapis.com/stable/stock/aapl/quote?token=Tpk_e4f71b7b5c7c4783ac5383e31f79a75f', {json: true}, (err, res, body) => {
    if (err) {return console.log(err);}
    if (res.statusCode === 200){
        //console.log(body);
        apiFINISHED(body);
    };
});

};//End of call-api function


//Set handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Set handlebars route hone
app.get('/', function (req, res) {
    call_api(function(apiLOADED){
            res.render('home',{
            stock: apiLOADED
        });
    });
});

//Set handlebars route about
app.get('/about', function (req, res) {
    res.render('about');
});

//Set handlebars route all-stocks
app.get('/all-stocks', function (req, res) {
    res.render('all-stocks');
});

//Set handlebars route stock-details
app.get('/stock-details', function (req, res) {
    res.render('stock-details');
});

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => console.log('Server listening on port ' + PORT));
