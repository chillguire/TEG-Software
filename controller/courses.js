const Course = require('../models/course');
const { v4: uuidV4 } = require('uuid');


module.exports.index = async (req, res) => {
    const courses = await Course.find({})
    res.render('courses/index', { courses });
}

module.exports.new = (req, res) => {
    res.render('courses/new');
}

module.exports.create = async (req, res, next) => {
    const newCourse = {
        name: req.body.name,
        description: req.body.description,
        roomID: uuidV4(),
    }

    const course = new Course(newCourse);
    await course.save();

    req.flash('success', 'Curso creado exitosamente');

    res.redirect(`/courses/${course._id}`);
}

module.exports.show = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        req.flash('error', 'El curso no existe');
        return res.redirect('/courses');
    }
    res.render('courses/show', { course });
}

module.exports.edit = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        req.flash('error', 'El curso no existe');
        return res.redirect('/courses');
    }
    res.render('courses/edit', { course });
}

module.exports.update = async (req, res) => {
    const editedCourse = {
        name: req.body.name,
        description: req.body.description,
    }

    const course = await Course.findByIdAndUpdate(req.params.id, { ...editedCourse });

    req.flash('success', 'Curso actualizado exitosamente');

    res.redirect(`/courses/${course._id}`);
}

module.exports.delete = async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);

    req.flash('success', 'Curso eliminado exitosamente');

    res.redirect(`/courses`);
}