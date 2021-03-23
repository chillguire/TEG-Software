const Course = require('../models/course');

const { v4: uuidV4 } = require('uuid');

const { isValidObjectId } = require('mongoose');
const sanitizeHtml = require('sanitize-html');


module.exports.renderAll = async (req, res) => {
    if (res.locals.currentUser.type == 'Instructor') {
        const courses = await Course.find({ instructor: res.locals.currentUser._id }).sort({ createdAt: 'desc' });
        res.render('courses/index', { courses: courses });
    } else if (res.locals.currentUser.type == 'Student') {
        const courses = await Course.find({ students: res.locals.currentUser._id }).sort({ createdAt: 'desc' });
        res.render('courses/index', { courses: courses });
    } else {
        const courses = await Course.find({}).sort({ createdAt: 'desc' });
        res.render('courses/index', { courses: courses });
    }
}

module.exports.renderNewForm = (req, res) => {
    let course;
    if (req.session.course) {
        course = req.session.course;
        req.session.course = null;
    } else {
        course = {
            name: '',
            description: '',
        }
    }
    res.render('courses/new', { course: course, instructor: res.locals.instructors });
}

module.exports.create = async (req, res, next) => {
    let newCourse = {}
    if (!req.body.instructor || !isValidObjectId(req.body.instructor)) {
        newCourse = {
            name: sanitizeHtml(req.body.name, {
                allowedTags: [],
                allowedAttributes: {},
            }),
            description: sanitizeHtml(req.body.description, {
                allowedTags: [],
                allowedAttributes: {},
            }),
            roomID: uuidV4(),
        }
    } else {
        newCourse = {
            name: sanitizeHtml(req.body.name, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            description: sanitizeHtml(req.body.description, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            roomID: uuidV4(),
            instructor: sanitizeHtml(req.body.instructor, {
                allowedTags: [],
                allowedAttributes: {}
            }),
        }
    }

    const course = new Course(newCourse);

    try {
        await course.save();
        req.flash('success', 'Curso creado exitosamente');
        res.redirect(`/courses/${course._id}`);
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/courses/new`);
    }
}

module.exports.renderSpecific = async (req, res) => {
    const course = await res.locals.course
        .populate({
            path: 'lessons',
            options: { sort: { createdAt: 'desc' } }
        })
        .populate({
            path: 'instructor',
        })
        .populate({
            path: 'students',
        })
        .execPopulate();
    res.render('courses/show', { course: course });
}

module.exports.renderEditForm = (req, res) => {
    let course;
    if (req.session.course) {
        course = req.session.course;
        req.session.course = null;

    } else {
        course = res.locals.course;
    }
    res.render('courses/edit', { course: course, instructor: res.locals.instructors });
}

module.exports.update = async (req, res) => {
    let editedCourse = {}
    if (!req.body.instructor || !isValidObjectId(req.body.instructor)) {
        editedCourse = {
            name: sanitizeHtml(req.body.name, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            description: sanitizeHtml(req.body.description, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            createdAt: Date.now(),
            instructor: undefined,
        }
    } else {
        editedCourse = {
            name: sanitizeHtml(req.body.name, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            description: sanitizeHtml(req.body.description, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            createdAt: Date.now(),
            instructor: sanitizeHtml(req.body.instructor, {
                allowedTags: [],
                allowedAttributes: {}
            }),
        }
    }
    try {
        await Course.findOneAndUpdate({ _id: req.params.id }, { ...editedCourse }, { new: true, runValidators: true });
        req.flash('success', 'Curso actualizado exitosamente');
        res.redirect(`/courses/${res.locals.course._id}`);
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/courses/${res.locals.course._id}/edit`);
    }
}

module.exports.renderStudentsForm = (req, res) => {
    res.render('courses/students', { course: res.locals.course, students: res.locals.students });
}

module.exports.updateStudents = async (req, res, next) => {
    const students = req.body.students;
    const course = res.locals.course;

    if (students) {
        for (let i = 0; i < students.length; i++) {
            if (course.students.includes(`${students[i]}`)) {
                continue;
            }
            await Course.findOneAndUpdate({ _id: course._id }, { $push: { students: sanitizeHtml(students[i]) } }, { new: true, runValidators: true });
        }

        for (let i = 0; i < course.students.length; i++) {
            if (!(students.includes(`${course.students[i]}`))) {
                await Course.findOneAndUpdate({ _id: course._id }, { $pull: { students: course.students[i] } }, { new: true, runValidators: true });
                continue;
            }
        }
    } else {
        for (let i = 0; i < course.students.length; i++) {
            await Course.findOneAndUpdate({ _id: course._id }, { $pull: { students: course.students[i] } }, { new: true, runValidators: true });
        }
    }

    try {
        await course.save();
        req.flash('success', 'Estudiantes actualizados exitosamente');
        res.redirect(`/courses/${res.locals.course._id}`);
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/courses/${res.locals.course._id}`);
    }
}

module.exports.delete = async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);

    req.flash('success', 'Curso eliminado exitosamente');
    res.redirect(`/courses`);
}