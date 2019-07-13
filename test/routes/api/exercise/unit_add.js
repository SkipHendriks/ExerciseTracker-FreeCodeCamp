import chai, {expect} from 'chai';
import shortid from 'shortid';
import sinon from 'sinon';
import sinonMongoose from 'sinon-mongoose';

import {User} from '../../../../models/user.js'
import {Exercise} from '../../../../models/exercise.js'
import {addExercise} from '../../../../routes/api/exercise/add.js';

describe('Unit::add Route', function() {
  describe('addExercise() function', function() {
 
    afterEach(() => {
      sinon.restore();
    });
    
    it('Should return new json object when called with all properties', async () => {
      
      const userId = shortid.generate();
      const username = 'user1';
      const description = 'swimming';
      const duration = 60;
      const dateString = '2010-04-27';
      const dateObject = new Date(dateString);
      
      const UserMock = sinon.mock(User);
      UserMock.expects('findOne')
              .withArgs({_id: userId})
              .resolves(new User({_id: userId, username}));

      
      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('create')
                  .withArgs({userId, description, duration, date: dateObject})
                  .resolves(new Exercise({userId, description, duration, date: dateObject}));
          
      const req = {body: {userId, description, duration, date: dateString}};
      const res = {json: sinon.spy()};
      await addExercise(req, res, null);
      
      UserMock.verify();
      UserMock.restore();
      
      ExerciseMock.verify();
      ExerciseMock.restore();
            
      expect(res.json.calledWith(sinon.match({
        username, _id: userId, description, duration,
        date: sinon.match((date) => {
          return date.getTime() === dateObject.getTime();
        }, 'correct datetime')
      }))).to.be.true;
    });
    
    
    it('Should return new json object with current date when called with empty date field', async () => {
      
      const clock = sinon.useFakeTimers({
        now: 1483228800000,
        toFake: ["Date"]
      });
      
      const userId = shortid.generate();
      const username = 'user1';
      const description = 'swimming';
      const duration = 60;
      const dateObject = new Date(Date.now());

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne')
              .withArgs({_id: userId})
              .resolves(new User({_id: userId, username}));

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('create')
                  .withArgs({userId, description, duration, date: dateObject})
                  .resolves(new Exercise({userId, description, duration, date: dateObject}));
          
      const req = {body: {userId, description, duration, date: ''}};
      const res = {json: sinon.spy()};
      await addExercise(req, res, null);
      
      UserMock.verify();
      UserMock.restore();
      
      ExerciseMock.verify();
      ExerciseMock.restore();
      
      clock.restore();
      
      expect(res.json.calledWith(sinon.match({
        username, _id: userId, description, duration,
        date: dateObject
      }))).to.be.true;
      
    });
    
    
    it('Should forward to errorhandler middleware upon Mongo error', async () => {

      const userId = shortid.generate();
      const username = 'user1';
      const description = 'swimming';
      const duration = 60;
      const dateString = '2010-04-27';
      const dateObject = new Date(dateString);
      
      const UserMock = sinon.mock(User);
      UserMock.expects('findOne')
              .withArgs({_id: userId})
              .throws({name: "NetworkTimeout", code: 89});

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('create')
                  .withArgs({userId, description, duration, date: dateObject})
                  .resolves(new Exercise({userId, description, duration, date: dateObject}));
      
      const req = {body: {userId, description, duration, date: dateString}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await addExercise(req, res, next);
      
      UserMock.verify();
      UserMock.restore();
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
        
    });
    
    
    it('Should forward to errorhandler middleware when a falsy userId is supplied', async () => {
      
      const userId = '';
      const description = 'swimming';
      const duration = 60;
      const dateString = '2010-04-27';
      
      const req = {body: {userId, description, duration, date: dateString}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await addExercise(req, res, next);
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("userId undefined");
    });
    
    
    it('Should forward to errorhandler middleware when a falsy description is supplied', async () => {
      
      const userId = shortid.generate();;
      const description = '';
      const duration = 60;
      const dateString = '2010-04-27';
      
      const req = {body: {userId, description, duration, date: dateString}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await addExercise(req, res, next);
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("description undefined");
    });
    
    
    it('Should forward to errorhandler middleware when a falsy duration is supplied', async () => {
      
      const userId = shortid.generate();;
      const description = 'swimming';
      const duration = 0;
      const dateString = '2010-04-27';
      
      const req = {body: {userId, description, duration, date: dateString}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await addExercise(req, res, next);
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("duration undefined");
    });
    
    
    it('Should forward to errorhandler middleware when a NaN duration is supplied', async () => {
      
      const userId = shortid.generate();;
      const description = 'swimming';
      const duration = 'weirdness';
      const dateString = '2010-04-27';
      
      const req = {body: {userId, description, duration, date: dateString}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await addExercise(req, res, next);
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("duration is NaN (Not a Number)");
    });
    
    
    it('Should forward to errorhandler middleware when a wrong date format is supplied', async () => {
      
      const userId = shortid.generate();;
      const description = 'swimming';
      const duration = 60;
      const dateString = '2010/14-27';
      
      const req = {body: {userId, description, duration, date: dateString}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await addExercise(req, res, next);
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("date format incorrect");
    });
  });
});
