const classModel = require('../models/classModel');

module.exports.listClasses = async (req, res, next) => {
  try {
    const classes = await classModel.listByUser(req.session.user_id);
    res.send(classes);
  } catch (err) {
    next(err);
  }
};

module.exports.createClass = async (req, res, next) => {
  try {
    const { name, instructor } = req.body;
    if (!name || !instructor) {
      return res.status(400).send({ error: 'Class name and instructor are required.' });
    }
    const newClass = await classModel.create(name, instructor, req.session.user_id);
    res.status(201).send(newClass);
  } catch (err) {
    next(err);
  }
};

module.exports.updateClass = async (req, res, next) => {
  try {
    const { class_id } = req.params;
    const existingClass = await classModel.find(class_id);
    if (!existingClass) return res.status(404).send({ error: 'Class not found.' });
    if (existingClass.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const { name, instructor } = req.body;
    if (!name || !instructor) {
      return res.status(400).send({ error: 'Class name and instructor are required.' });
    }
    const updated = await classModel.update(class_id, { name, instructor });
    res.send(updated);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteClass = async (req, res, next) => {
  try {
    const { class_id } = req.params;
    const existingClass = await classModel.find(class_id);
    if (!existingClass) return res.status(404).send({ error: 'Class not found.' });
    if (existingClass.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const destroyed = await classModel.destroy(class_id);
    res.send(destroyed);
  } catch (err) {
    next(err);
  }
};
