if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}
// console.log(process.env.CLOUNDINARY_SECRET)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const mongoSanitize = require('express-mongo-sanitize');

const ExpressError = require('./utils/ExpressError');
const userRoutes = require('./routes/users') 
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/camps-engine';
const MongoDBStore = require("connect-mongo");

main()
.then(()=>console.log("MONGO CONNECTION OPEN"))
.catch(err => {
    console.log("MONGO CONNECTION ERROR");
    console.log(err);
});
// 

async function main() {
  await mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  });
}

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride('_method'))
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
    replaceWith:'_'}
));
const secret =  process.env.SECRET || 'betterbeasecret';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*60*60
})
store.on("error",function(e){
    console.log('SESSION STORE ERROR',e);
})
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge:  1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());
// app.use(helmet({contentSecurityPolicy: false}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('Success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/',(req,res)=>{
    res.render('home');
})


app.all("*",(req,res,next)=>{
    // res.send('404!!!')
    next(new ExpressError('Page not found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message = "Something is'nt right";
    res.status(statusCode).render('error',{err});
    // res.send('Something is Wrong')
})
app.listen(3000,()=>{
    console.log('Serving on port 3000');
})