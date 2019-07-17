import User from '../../../models/user.js';

// [POST] endpoint for adding a user
const addUser = async (req, res, next) => {
  try {
    if (!req.body.username) {
      const err = new Error('username undefined');
      err.status = 400;
      throw err;
    }
    const newUser = await User.create({ username: req.body.username });
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (err) {
    next(err);
  }
};

export default addUser;
