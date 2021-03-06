const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const User = require('./models/user');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const flash = require('connect-flash');

const { isLoggedIn } = require('./middleware/auth');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


//** DB
mongoose.connect('mongodb://localhost/LMS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DB connected');
});

//** APP CONFIG
const app = express();

app.use(express.urlencoded({ extended: true, }));
// app.use(express.json());

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'Chavez no puede ver esto porqué está MUERTO',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // ms/s * s/m * m/h * h/d * d/w
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
});

//** ROUTES
app.get('/', (req, res) => {
    res.redirect('/courses');
});

const courseRoutes = require('./routes/courses');
app.use('/courses', courseRoutes);

// const lessons = require('./routes/lessons');
// app.use('/courses/:id/lessons', lessons);

const userRoutes = require('./routes/users');
app.use(userRoutes);

app.all('*', isLoggedIn, (req, res, next) => {
    res.sendStatus(404);
});

//** ERROR HANDLING
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Something went wrong';
    }
    res.status(statusCode).render('error', { err });
});

//** APP.LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running: ${port}`);
});