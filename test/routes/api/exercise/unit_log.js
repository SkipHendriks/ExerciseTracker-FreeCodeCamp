/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import User from '../../../../models/user.js';
import Exercise from '../../../../models/exercise.js';
import listExercises from '../../../../routes/api/exercise/log.js';

describe('Unit::log Route', () => {
  describe('listExercises() function', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Should return json log object from only userId', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id: user._id }).resolves(user);

      const exercise1 = new Exercise({
        userId: user._id,
        description: 'swimming',
        duration: 60,
        date: new Date('2010-04-16'),
      });

      const exercise2 = new Exercise({
        userId: user._id,
        description: 'dreaming',
        duration: 120,
        date: new Date('2011-02-05'),
      });

      const exercises = [exercise1, exercise2];

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({ userId: user._id })
        .chain('limit')
        .withArgs(undefined)
        .chain('select')
        .withArgs(['-userId'])
        .resolves(exercises);

      const res = { json: sinon.spy() };
      const req = { query: { userId: user._id } };
      await listExercises(req, res, null);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.verify();
      ExerciseMock.restore();

      const expected = {
        ...user.toObject(),
        log: exercises,
        count: exercises.length,
      };

      expect(res.json.calledWith(expected)).to.be.true;
    });

    it('Should return json log object from userId, toDate, fromDate, limit (all properties))', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id: user._id }).resolves(user);

      const exercise1 = new Exercise({
        userId: user._id,
        description: 'swimming',
        duration: 60,
        date: new Date('2010-04-16'),
      });

      const exercise2 = new Exercise({
        userId: user._id,
        description: 'dreaming',
        duration: 120,
        date: new Date('2011-02-05'),
      });

      const exercises = [exercise1, exercise2];

      const fromDate = '2010-04-01';
      const toDate = '2011-04-01';

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({
          userId: user._id,
          date: {
            $lte: new Date(toDate),
            $gte: new Date(fromDate),
          },
        }).chain('limit')
        .withArgs(2)
        .chain('select')
        .withArgs(['-userId'])
        .resolves(exercises);

      const res = { json: sinon.spy() };
      const req = {
        query: {
          userId: user._id,
          to: toDate,
          from: fromDate,
          limit: 2,
        },
      };
      await listExercises(req, res, null);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.verify();
      ExerciseMock.restore();

      const expected = {
        ...user.toObject(),
        log: exercises,
        count: exercises.length,
      };

      expect(res.json.calledWith(expected)).to.be.true;
    });

    it('Should switch to use of body if no query is defined', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id: user._id }).resolves(user);

      const exercise1 = new Exercise({
        userId: user._id,
        description: 'swimming',
        duration: 60,
        date: new Date('2010-04-16'),
      });

      const exercise2 = new Exercise({
        userId: user._id,
        description: 'dreaming',
        duration: 120,
        date: new Date('2011-02-05'),
      });

      const exercises = [exercise1, exercise2];

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({ userId: user._id })
        .chain('limit')
        .withArgs(undefined)
        .chain('select')
        .withArgs(['-userId'])
        .resolves(exercises);

      const res = { json: sinon.spy() };
      const req = {
        query: {},
        body: {
          userId: user._id,
        },
      };
      await listExercises(req, res, null);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.verify();
      ExerciseMock.restore();

      const expected = {
        ...user.toObject(),
        log: exercises,
        count: exercises.length,
      };

      expect(res.json.calledWith(expected)).to.be.true;
    });

    it('Should forward to errorhandler when userId is\'t specified', async () => {
      const UserMock = sinon.mock(User);
      const ExerciseMock = sinon.mock(Exercise);

      const req = { query: {}, body: {} };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
    });

    it('Should forward to errorhandler when userId isn\'t specified', async () => {
      const UserMock = sinon.mock(User);
      const ExerciseMock = sinon.mock(Exercise);

      const req = { query: {}, body: {} };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal('userId undefined');
    });

    it('Should forward to errorhandler when fromDate isn\'t formatted correctly', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      const ExerciseMock = sinon.mock(Exercise);

      const req = {
        query: {
          userId: user._id,
          from: 'not-a-date',
        },
      };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("'from' date format incorrect");
    });

    it('Should forward to errorhandler when toDate isn\'t formatted correctly', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      const ExerciseMock = sinon.mock(Exercise);

      const req = {
        query: {
          userId: user._id,
          to: 'not-a-date',
        },
      };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal("'to' date format incorrect");
    });

    it('Should forward to errorhandler when toDate comes before fromDate', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      const ExerciseMock = sinon.mock(Exercise);

      const req = {
        query: {
          userId: user._id,
          from: '2010-05-01',
          to: '2010-04-01',
        },
      };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal('\'to\' date comes before \'from\' date');
    });

    it('Should forward to errorhandler when fromDate equals toDate', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      const ExerciseMock = sinon.mock(Exercise);

      const req = {
        query: {
          userId: user._id,
          from: '2010-05-01',
          to: '2010-05-01',
        },
      };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal('\'to\' is equal to \'from\' date');
    });

    it('Should forward to errorhandler when fromDate equals toDate', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      const ExerciseMock = sinon.mock(Exercise);

      const req = {
        query: {
          userId: user._id,
          limit: 'not-a-number',
        },
      };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(400);
      expect(next.firstCall.args[0].message).to.equal('limit is NaN (Not a Number)');
    });

    it('Should forward to errorhandler middleware upon Mongo error', async () => {
      const user = new User({ username: 'user1' });

      const UserMock = sinon.mock(User);
      UserMock.expects('findOne').withArgs({ _id: user._id }).throws({ name: 'NetworkTimeout', code: 89 });

      const ExerciseMock = sinon.mock(Exercise);

      const req = {
        query: {
          userId: user._id,
        },
      };
      const res = { json: sinon.spy() };
      const next = sinon.spy();
      await listExercises(req, res, next);

      UserMock.verify();
      UserMock.restore();

      ExerciseMock.restore();

      expect(res.json.callCount).to.deep.equal(0);
      expect(next.callCount).to.deep.equal(1);
    });
  });
});
