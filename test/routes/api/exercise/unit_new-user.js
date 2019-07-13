import chai, {expect} from 'chai';
import shortid from 'shortid';
import sinon from 'sinon';
import sinonMongoose from 'sinon-mongoose';

import {User} from '../../../../models/user.js'
import {newUser} from '../../../../routes/api/exercise/new-user.js';

describe('Unit::new-user Route', function() {
  describe('newUser() function', function() {
 
    afterEach(() => {
      sinon.restore();
    });
    
    it('Should return new json user object when called with username', async () => {

      const UserMock = sinon.mock(User);
      UserMock.expects('create')
              .withArgs({username: 'user1'})
              .resolves(new User({username: 'user1'}));
      
      const req = {body: {username: 'user1'}};
      const res = {json: sinon.spy()};
      await newUser(req, res, null);
      
      UserMock.verify();
      UserMock.restore();
            
      expect(res.json.calledWith(sinon.match({username: 'user1', _id: sinon.match.string}))).to.be.true;
    });
    
    it('Should forward to errorhandler middleware upon Mongo error', async () => {

      const UserMock = sinon.mock(User);
      UserMock.expects('create')
              .withArgs({username: 'user1'})
              .throws({name: "NetworkTimeout", code: 89})
      
      const req = {body: {username: 'user1'}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await newUser(req, res, next);
      
      UserMock.verify();
      UserMock.restore();
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
        
    });
    
  
    
    it('Should forward to errorhandler middleware when username is falsy', async () => {
      
      const req = {body: {username: ''}};
      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await newUser(req, res, next);
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("Username undefined");
    });
  });
});
