/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import shortid from 'shortid';
import sinon from 'sinon';
import 'sinon-mongoose';

import User from '../../../../models/user.js';
import getUser from '../../../../routes/api/exercise/user.js';

describe('Unit::user Route', () => {
  describe('getUser() function', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Should return user from _id in params', async () => {
      const _id = shortid.generate();
      const user = new User({ _id, username: 'user1' });

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id }).resolves(user);

      const req = { params: { _id }, query: {}, body: {} };
      const res = { json: sinon.spy() };
      await getUser(req, res, null);

      UserMock.verify();
      UserMock.restore();

      expect(res.json.calledWith(user)).to.be.true;
    });

    it('Should return user from userId in query', async () => {
      const _id = shortid.generate();
      const user = new User({ _id, username: 'user1' });

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id }).resolves(user);

      const req = { params: {}, query: { userId: _id }, body: {} };
      const res = { json: sinon.spy() };
      await getUser(req, res, null);

      UserMock.verify();
      UserMock.restore();

      expect(res.json.calledWith(user)).to.be.true;
    });

    it('Should return user from _id in body', async () => {
      const _id = shortid.generate();
      const user = new User({ _id, username: 'user1' });

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id }).resolves(user);

      const req = { params: {}, query: {}, body: { _id } };
      const res = { json: sinon.spy() };
      await getUser(req, res, null);

      UserMock.verify();
      UserMock.restore();

      expect(res.json.calledWith(user)).to.be.true;
    });

    it('Should forward to errorhandler middleware upon Mongo error', async () => {
      const _id = shortid.generate();

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id }).throws({ name: 'NetworkTimeout', code: 89 });

      const req = { params: { _id }, query: {}, body: {} };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await getUser(req, res, next);

      UserMock.verify();
      UserMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
    });

    it('Should forward to errorhandler middleware when _id is not suplied', async () => {
      // both username and _id specified
      const req = { params: {}, query: {}, body: {} };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await getUser(req, res, next);

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.deep.equal('_id undefined');
    });
  });
});
