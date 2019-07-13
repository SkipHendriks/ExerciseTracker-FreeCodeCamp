import chai, {expect} from 'chai';
import sinon from "sinon";
import sinonMongoose from 'sinon-mongoose';
import {isValid} from 'shortid';

import {User} from "../../models/user.js";


describe('Unit::user Model', function() {
  describe('findById static function', function() {
   
    it('Should call the findOne function of the model with the given _id as query', async () => {

      const _id = 'test';
      
      const UserMock = sinon.mock(User);
      UserMock.expects('findOne')
              .withArgs({_id});
      
      User.findById(_id);

      UserMock.verify();
      UserMock.restore();

      sinon.restore();
    });
  });
  describe('mongoose-hidden plugin', function() {
    it('Should remove __v from toObject(), but leave _id', async () => {

      const userObject = new User({username: 'test'}).toObject();
      
      expect(userObject).to.not.have.property('__v');
      expect(userObject).to.have.property('_id');

    });
  });
  describe('model itself', function() {
    
    it('Should create an _id for every new user', async () => {

      const userObject = new User({username: 'test'});
      
      expect(isValid(userObject._id)).to.be.true;

    });
  });
});
