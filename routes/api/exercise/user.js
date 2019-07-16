import User from '../../../models/user.js';

// [GET] endpoint for finding the corresponding username
const getUser = async (req, res, next) => {
  try {
    const _id = req.params._id || req.query.userId || req.body._id;

    inputValidation(_id);

    const user = await User.findById(_id);

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const inputValidation = (_id) => {
  if (!_id) {
    const err = new Error('_id undefined');
    err.status = 400;
    throw err;
  }
};

export default getUser;
