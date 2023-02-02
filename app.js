const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const sessionConfig = {
    secret: "thisisnotasecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24
    }
 }
 const app = express();
 const db = mongoose.connection;
 app.use(session(sessionConfig));
 app.use(express.urlencoded({extended:true}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const userRoutes = require('./routes/users')
const campground = require('./routes/campground');
const review = require('./routes/reviews');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');


db.on('error', console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Connection Established");
    console.log("Database connected");
});
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.use(flash());
app.use((req,res,next)=>{
    req.session.returnTo = req.originalUrl;

    req.session.returnTo =  req.originalUrl; 
    res.locals.currentUser = req.user;
    res.locals.success= req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeUser', async(req,res)=>{
    const user = new User({email:'chicken@gmail.com', username:"ken22"});
    const newUser = await User.register(user, "chicken");
    res.send(newUser);
});

app.use('/', userRoutes);
app.use('/campgrounds', campground);
app.use('/campgrounds/:id/reviews', review);

app.get('/', (req,res)=>{
    res.render('home');
});


app.all('*', (req,res,next)=>{
    next(new ExpressError("Page Not Found!!!", 404));
});
app.use((err, req,res, next)=>{
    const {statusCode=500} = err;
    if(!err.message) err = 'Oh oh Something Went Wrong!'
    res.status(statusCode).render("erro",{err});

});
app.listen(3000, ()=>{
    console.log("Listening on PORT 3000");
});