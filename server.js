const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { courseSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Course = require('./models/course');

//** MIDDLEWARE

function validateCourse(req, res, next) {

    const course = {
        name: req.body.name,
        description: req.body.description,
    }

    const { error } = courseSchema.validate(course);

    if (error) {
        // const msg = error.details.map(el => el.message).join(',');
        const errors = [];
        for (let i = 0; i < error.details.length; i++) {
            errors[i] = error.details[i].message;
            throw new ExpressError(errors, 400);
        }
    } else {
        next();
    }
}

//** DB
mongoose.connect('mongodb://localhost/LMS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.set('useFindAndModify', false);

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
app.use(express.static('public'));

//** ROUTES
app.get('/', (req, res) => {
    res.render('home')
});

app.get('/courses', catchAsync(async (req, res) => {
    const courses = await Course.find({})
    res.render('courses/index', { courses });
}));

app.get('/courses/new', (req, res) => {
    res.render('courses/new');
});

app.post('/courses', validateCourse, catchAsync(async (req, res, next) => {

    const newCourse = {
        name: req.body.name,
        description: req.body.description,
    }

    const course = new Course(newCourse);
    await course.save();

    res.redirect(`/courses/${course._id}`);
}));

app.get('/courses/:id', catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('courses/show', { course });
}));

app.get('/courses/:id/edit', catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('courses/edit', { course });
}));

app.put('/courses/:id', validateCourse, catchAsync(async (req, res) => {
    const editedCourse = {
        name: req.body.name,
        description: req.body.description,
    }

    const course = await Course.findByIdAndUpdate(req.params.id, { ...editedCourse })

    res.redirect(`/courses/${course._id}`);
}));

app.delete('/courses/:id', catchAsync(async (req, res) => {
    await Course.findByIdAndDelete(req.params.id)
    res.redirect(`/courses`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
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