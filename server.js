require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

const mongoose = require('mongoose');
const User = require('./models/user');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const io = require('socket.io')(http);
const sockets = require('./sockets')(io);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(http, {
    debug: true
});

const { isLoggedIn } = require('./middleware/middleware');

const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');


//** DB CONFIG
const dbURL = process.env.DB_URL;
mongoose.connect(dbURL, {
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
//? general
app.use(express.urlencoded({ extended: true, }));
// app.use(express.json());

//? security
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false, }));

//? views and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//? sessions
app.use(flash());

const sessionSecret = process.env.SESSION_SECRET;
const store = MongoStore.create({
    mongoUrl: dbURL,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60,
});

store.on('error', function (error) {
    console.log(error);
});

const sessionConfig = {
    name: 'SessionLMS',
    secret: sessionSecret,
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // ms/s * s/m * m/h * h/d * d/w
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

//? auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//? global variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
});

//? webRTC
app.use('/peerjs', peerServer);


//** ROUTES
app.get('/', (req, res) => {
    res.redirect('/login');
});

const courseRoutes = require('./routes/courses');
app.use('/courses', courseRoutes);

const roomRoutes = require('./routes/rooms');
app.use('/courses', roomRoutes);

const lessons = require('./routes/lessons');
app.use('/courses/:id/lessons', lessons);

const userRoutes = require('./routes/users');
app.use(userRoutes);

app.all('*', isLoggedIn, (req, res, next) => {
    res.sendStatus(404);
});


//** APP.LISTEN
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Running: ${port}`);
});