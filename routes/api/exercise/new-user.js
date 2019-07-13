// TODO accept params as well

import {User} from '../../../models/user.js';

// [POST] endpoint for adding a user
const newUser = async (req, res, next) => {
  try {
    if (!req.body.username) {
      const err = new Error("Username undefined");
      err.status = 400;
      throw err;
    }
    const new_user = await User.create({username: req.body.username});
    res.json({username: new_user.username, _id: new_user._id});
  } catch (err) {
    next(err);
  }
};

export {newUser}