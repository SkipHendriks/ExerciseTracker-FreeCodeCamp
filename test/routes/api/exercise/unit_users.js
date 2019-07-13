import chai, {expect} from 'chai';
import shortid from 'shortid';
import sinon from 'sinon';
import sinonMongoose from 'sinon-mongoose';

import {User} from '../../../../models/user.js'
import {listUsers} from '../../../../routes/api/exercise/users.js';

describe('Unit::users Route', function() {
  describe('listUsers() function', function() {
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('Should return json list of user objects', async () => {
      
      const user1 = new User({id_: shortid.generate(), username: 'user1'});
      const user2 = new User({id_: shortid.generate(), username: 'user2'});
      const expected = [user1, user2];
      
      const UserMock = sinon.mock(User);
      UserMock.expects('find').resolves(expected);
      
      const res = {json: sinon.spy()};
      await listUsers(null, res, null);
      
      UserMock.verify();
      UserMock.restore();
      
      expect(res.json.calledWith(expected)).to.be.true;
    });
    
    it('Should forward to errorhandler middleware upon Mongo error', async () => {

      const UserMock = sinon.mock(User);
      UserMock.expects('find').throws({name: "NetworkTimeout", code: 89});

      const res = {json: sinon.spy()};
      const next = sinon.spy();
      await listUsers(null, res, next);
      
      UserMock.verify();
      UserMock.restore();
      
      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
    });
  })
});