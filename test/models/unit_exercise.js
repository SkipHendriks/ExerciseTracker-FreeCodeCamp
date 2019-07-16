/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';
import { isValid } from 'shortid';

import Exercise from '../../models/exercise.js';


describe('Unit::user Model', () => {
  describe('findById static function', () => {
    it('Should call find with correct query when _id is given', async () => {
      const _id = 'test';

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({ userId: _id })
        .chain('limit')
        .withArgs(undefined)
        .chain('select')
        .withArgs(['-userId']);

      Exercise.getExerciseLog(_id, undefined, undefined, undefined);

      ExerciseMock.verify();
      ExerciseMock.restore();
    });

    it('Should call find with correct query when _id, fromDate are given', async () => {
      const _id = 'test';
      const fromDate = new Date('2010-04-01');

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({ userId: _id, date: { $gte: fromDate } })
        .chain('limit')
        .withArgs(undefined)
        .chain('select')
        .withArgs(['-userId']);

      Exercise.getExerciseLog(_id, fromDate, undefined, undefined);

      ExerciseMock.verify();
      ExerciseMock.restore();
    });

    it('Should call find with correct query when userId, toDate are given', async () => {
      const _id = 'test';
      const toDate = new Date('2011-04-01');

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({ userId: _id, date: { $lte: toDate } })
        .chain('limit')
        .withArgs(undefined)
        .chain('select')
        .withArgs(['-userId']);

      Exercise.getExerciseLog(_id, undefined, toDate, undefined);

      ExerciseMock.verify();
      ExerciseMock.restore();
    });

    it('Should call find with correct query when userId, fromDate, toDate are given', async () => {
      const _id = 'test';
      const fromDate = new Date('2010-04-01');
      const toDate = new Date('2011-04-01');
      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({
          userId: _id,
          date: {
            $lte: toDate,
            $gte: fromDate,
          },
        })
        .chain('limit')
        .withArgs(undefined)
        .chain('select')
        .withArgs(['-userId']);

      Exercise.getExerciseLog(_id, fromDate, toDate, undefined);

      ExerciseMock.verify();
      ExerciseMock.restore();
    });

    it('Should call find with correct query when userId, limit are given', async () => {
      const _id = 'test';
      const limit = 2;

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({ userId: _id })
        .chain('limit')
        .withArgs(limit)
        .chain('select')
        .withArgs(['-userId']);

      Exercise.getExerciseLog(_id, undefined, undefined, limit);

      ExerciseMock.verify();
      ExerciseMock.restore();
    });

    it('Should call find with correct query when userId, toDate, fromDate, limit are given', async () => {
      const _id = 'test';
      const fromDate = new Date('2010-04-01');
      const toDate = new Date('2011-04-01');
      const limit = 2;

      const ExerciseMock = sinon.mock(Exercise);
      ExerciseMock.expects('find')
        .withArgs({
          userId: _id,
          date: {
            $lte: toDate,
            $gte: fromDate,
          },
        })
        .chain('limit')
        .withArgs(limit)
        .chain('select')
        .withArgs(['-userId']);

      Exercise.getExerciseLog(_id, fromDate, toDate, limit);

      ExerciseMock.verify();
      ExerciseMock.restore();
    });
  });
  describe('mongoose-hidden plugin', () => {
    it('Should remove __v and _id from toObject()', async () => {
      const _id = 'test';

      const exerciseObject = new Exercise({
        userId: _id,
        description: 'swimming',
        duration: 60,
        date: new Date('2010-04-16'),
      }).toObject();

      expect(exerciseObject).to.not.have.property('__v');
      expect(exerciseObject).to.not.have.property('_id');
    });
  });
  describe('model itself', () => {
    it('Should create an _id for every new exercise', async () => {
      const exerciseObject = new Exercise({ username: 'test' });

      expect(isValid(exerciseObject._id)).to.be.true;
    });
  });
});
