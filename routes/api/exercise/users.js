import {User} from '../../../models/user.js';

// [GET] endpoint for listing all users
const listUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export {listUsers};