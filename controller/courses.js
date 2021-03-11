const Course = require('../models/course');
const { v4: uuidV4 } = require('uuid');

const sanitizeHtml = require('sanitize-html');


module.exports.index = async (req, res) => {
    const courses = await Course.find({}).sort({ createdAt: 'desc' });
    res.render('courses/index', { courses });
}

module.exports.new = (req, res) => {
    if (req.session.course) {
        const course = req.session.course;
        req.session.course = null;
        res.render('courses/new', { course: course });
    } else {
        const course = {
            name: '',
            description: '',
        }
        res.render('courses/new', { course: course });
    }
}

module.exports.create = async (req, res, next) => {
    const newCourse = {
        name: sanitizeHtml(req.body.name, {
            allowedTags: [],
            allowedAttributes: {}
        }),
        description: sanitizeHtml(req.body.description, {
            allowedTags: [],
            allowedAttributes: {}
        }),
        roomID: uuidV4(),
    }
    const course = new Course(newCourse);

    try {
        await course.save();
        req.flash('success', 'Curso creado exitosamente');
        res.redirect(`/courses/${course._id}`);
    } catch (error) {
        res.redirect(`/courses/new`);
    }
}

module.exports.show = async (req, res) => {
    const course = await res.locals.course
        .populate({
            path: 'lessons',
            options: { sort: { createdAt: 'asc' } }
        })
        .populate('instructor')
        .execPopulate();
    console.log(course);
    res.render('courses/show', { course: course });
}

module.exports.edit = (req, res) => {
    if (req.session.course) {
        const course = req.session.course;
        req.session.course = null;
        res.render('courses/edit', { course: course });
    } else {
        res.render('courses/edit', { course: res.locals.course });
    }
}

module.exports.update = async (req, res) => {
    const editedCourse = {
        name: sanitizeHtml(req.body.name, {
            allowedTags: [],
            allowedAttributes: {}
        }),
        description: sanitizeHtml(req.body.description, {
            allowedTags: [],
            allowedAttributes: {}
        }),
        createdAt: Date.now(),
    }

    try {
        await Course.findOneAndUpdate({ _id: req.params.id }, { ...editedCourse }, { new: true, runValidators: true });
        req.flash('success', 'Curso actualizado exitosamente');
        res.redirect(`/courses/${res.locals.course._id}`);
    } catch (error) {
        res.redirect(`/courses/${res.locals.course._id}/edit`);
    }
}

module.exports.delete = async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);

    req.flash('success', 'Curso eliminado exitosamente');
    res.redirect(`/courses`);
}