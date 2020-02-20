var express = require('express')
var app = express();
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var methodOveride = require('method-override')
var mongoose = require('mongoose');
var session = require('express-session')
var flash = require('connect-flash')
var passport = require('passport')
var db = require("./helper/database")


//load routes
var games = require('./routes/games')
var users = require('./routes/users')

//load passport
require('./config/passport')(passport)

//connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    console.log('mongodb connected')
}).catch(function (err) {
        console.log(err)
});



var urlencodedParser = bodyParser.urlencoded({ extend: false });


//this code sets up template engine as express handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOveride('_method'))


//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())



//Setup for flash messaging
app.use(flash());


//Global varaibles for flash messaging
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})





//get route using express-handlebars
app.get('/', function (req, res) {
    var title = "Welcome To Video Game Library!"
    res.render('index', {
        title: title
    });
});

app.get('/about', function (req, res) {
    res.render('about');
});


//Game Entry Crud route

app.use('/game', games);
app.use('/users', users)

var port = process.env.port || 5000


app.listen(port, function () {

    console.log("Server is running on 5000")
        ;
})