const User = require('../../models/user');

// [POST] endpoint for adding a user
const newUser = async (req, res, next) => {
  try {
    if (req.body.username == '') {
      const err = new Error("Username undefined");
      err.status = 400;
      throw err;
    }
    const new_user = new User ({username: req.body.username});
    await new_user.save();
    res.json({username: new_user.username, _id: new_user._id});
  } catch (err) {
    next(err);
  }
};

module.exports = newUser;