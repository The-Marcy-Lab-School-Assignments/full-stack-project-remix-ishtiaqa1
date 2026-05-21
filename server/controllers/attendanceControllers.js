const attendanceModel = require('../models/attendanceModel');
const classModel = require('../models/classModel');

module.exports.listRecords = async (req, res, next) => {
  try {
    const { class_id } = req.query;
    let records;
    if (class_id) {
      const cls = await classModel.find(class_id);
      if (!cls || cls.user_id !== req.session.user_id) {
        return res.status(403).send({ error: 'Not authorized.' });
      }
      records = await attendanceModel.listByClass(class_id, req.session.user_id);
    } else {
      records = await attendanceModel.listByUser(req.session.user_id);
    }
    res.send(records);
  } catch (err) {
    next(err);
  }
};

module.exports.getStats = async (req, res, next) => {
  try {
    const stats = await attendanceModel.statsByUser(req.session.user_id);
    res.send(stats);
  } catch (err) {
    next(err);
  }
};

module.exports.createRecord = async (req, res, next) => {
  try {
    const { class_id, date, status, notes } = req.body;
    if (!class_id || !date || !status) {
      return res.status(400).send({ error: 'class_id, date, and status are required.' });
    }

    const validStatuses = ['present', 'absent', 'late', 'excused'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const cls = await classModel.find(class_id);
    if (!cls) return res.status(404).send({ error: 'Class not found.' });
    if (cls.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const record = await attendanceModel.create(class_id, date, status, notes, req.session.user_id);
    res.status(201).send(record);
  } catch (err) {
    next(err);
  }
};

module.exports.updateRecord = async (req, res, next) => {
  try {
    const { record_id } = req.params;
    const record = await attendanceModel.find(record_id);
    if (!record) return res.status(404).send({ error: 'Record not found.' });
    if (record.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const { status, notes } = req.body;
    const validStatuses = ['present', 'absent', 'late', 'excused'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).send({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await attendanceModel.update(record_id, {
      status: status || record.status,
      notes: notes !== undefined ? notes : record.notes,
    });
    res.send(updated);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteRecord = async (req, res, next) => {
  try {
    const { record_id } = req.params;
    const record = await attendanceModel.find(record_id);
    if (!record) return res.status(404).send({ error: 'Record not found.' });
    if (record.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const destroyed = await attendanceModel.destroy(record_id);
    res.send(destroyed);
  } catch (err) {
    next(err);
  }
};
