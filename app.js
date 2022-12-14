if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./backend/models/user');

// Importing all routes
const userRoutes = require('./backend/routes/users_route');
const postRoutes = require('./backend/routes/post_route');
const replyRoutes = require('./backend/routes/replies_route');


const mongoSanitize = require('express-mongo-sanitize');

const MongoStore = require('connect-mongo');


const database = process.env.DB_URL || 'mongodb://localhost:27017/social-project';

//process.env.DB_URL
//'mongodb://localhost:27017/social-project'

mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database:"));
db.once("open", () => {
    console.log("Database successfully connected");
});

const store = new MongoStore({
    mongoUrl: database,
    secret: process.env.SECRET || 'testsecret',
    touchAfter: 34 * 3600
})

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const sessionConfig = {
    store: store,
    name: 'session',
    secret: process.env.SECRET || 'testsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('home')
});

app.use('/', userRoutes);
app.use('/posts', postRoutes)
app.use('/posts/:id/replies', replyRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.listen(process.env.PORT || 3000);



