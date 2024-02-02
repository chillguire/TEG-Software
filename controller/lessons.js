const Course = require('../models/course');
const Lesson = require('../models/lesson');

const marked = require('marked');
const removeMD = require('remove-markdown');
const sanitizeHtml = require('sanitize-html');


module.exports.renderNewForm = (req, res) => {
    if (req.session.lesson) {
        const lesson = req.session.lesson;
        console.log(req.session.lesson);
        req.session.lesson = null;
        res.render('lessons/new', { course: res.locals.course, lesson: lesson });
    } else {
        const lesson = {
            name: '',
            description: '',
        }
        res.render('lessons/new', { course: res.locals.course, lesson: lesson });
    }
}

module.exports.create = async (req, res, next) => {
    const course = res.locals.course;
    const newLesson = {
        name: sanitizeHtml(req.body.name, {
            allowedTags: [],
            allowedAttributes: {}
        }),
        OGdescription: req.body.description,
        descriptionMD: removeMD(req.body.description),
        sanitizedDescription: sanitizeHtml(marked.parse(req.body.description)),
        course: course._id,
    }
    const lesson = new Lesson(newLesson);
    course.lessons.push(lesson);

    try {
        await Promise.all([lesson.save(), course.save()]);
        req.flash('success', 'Leccion creada exitosamente');
        res.redirect(`/courses/${course._id}/lessons/${lesson._id}`);
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/courses/${course._id}/lessons/new`);
    }
}

module.exports.renderSpecific = (req, res) => {
    res.render('lessons/show', { course: res.locals.course, lesson: res.locals.lesson });
}

module.exports.renderEditForm = (req, res) => {
    if (req.session.lesson) {
        res.locals.lesson.name = req.session.lesson.name;
        res.locals.lesson.OGdescription = req.session.lesson.description;
        req.session.lesson = null;
    }
    res.render('lessons/edit', { lesson: res.locals.lesson });
}

module.exports.update = async (req, res) => {
    const editedLesson = {
        name: sanitizeHtml(req.body.name, {
            allowedTags: [],
            allowedAttributes: {}
        }),
        OGdescription: req.body.description,
        descriptionMD: removeMD(req.body.description),
        sanitizedDescription: sanitizeHtml(marked.parse(req.body.description)),
    }

    try {
        await Lesson.findOneAndUpdate({ _id: req.params.lessonID }, { ...editedLesson }, { new: true, runValidators: true });
        req.flash('success', 'Lección actualizada exitosamente');
        res.redirect(`/courses/${res.locals.course._id}/lessons/${res.locals.lesson._id}`);
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/courses/${res.locals.course._id}/lessons/${res.locals.lesson._id}/edit`);
    }
}

module.exports.delete = async (req, res) => {
    await Course.findByIdAndUpdate(res.locals.course._id, { $pull: { lessons: req.params.lessonID } });
    await Lesson.findByIdAndDelete(req.params.lessonID);

    req.flash('success', 'Lección eliminada exitosamente');
    res.redirect(`/courses/${res.locals.course._id}`);
}