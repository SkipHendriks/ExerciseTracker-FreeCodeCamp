import {User} from '../../../models/user.js';

// [GET] endpoint for listing users
const getUser = async (req, res, next) => {
  try {
    const _id = req.params._id || req.query.userId || req.body._id
    const username = req.body.username || req.query.userId;
    
    inputValidation(_id, username);
    
    const query = _id ? {_id} : {username};
    const user = await User.findOne(query);
    
    res.json(user);  
  } catch (err) {
    next(err);
  }
};

const inputValidation = (_id, username) => {
  if (!_id && !username) {
    const err = new Error("_id undefined");
    err.status = 400;
    throw err;
  } else if (_id && username) {
    const err = new Error("specify _id or username, not both");
    err.status = 400;
    throw err;
  }
}

export {getUser};