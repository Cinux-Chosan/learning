var express = require('express');

var app = express();

/* 在创建 Handlebars 实例时，我们指明了默认布局（ defaultLayout:'main' ） 。这就意味
着除非你特别指明，否则所有视图用的都是这个布局
*/
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    //res.send("ddddddddd");
    res.render('home');
});
app.get('/about', function(req, res) {
    res.render('about');
});


app.listen(8888, function() {
    console.log("Listening");
});
