/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import { isValid } from 'shortid';

import App from '../../../../server.js';
import User from '../../../../models/user.js';
import Exercise from '../../../../models/exercise.js';

chai.use(chaiHttp);

describe('Integration::log Route', () => {
  before(async () => {
    try {
      if (mongoose.connections.length > 0) {
        await mongoose.disconnect();
      }
      await mongoose.connect(process.env.MLAB_TEST_URI,
        { useNewUrlParser: true, useCreateIndex: true });
      await mongoose.connection.dropDatabase();
    } catch (err) {
      console.error(err);
    }
  });

  after(async () => {
    try {
      await mongoose.disconnect();
    } catch (err) {
      console.error(err);
    }
  });

  afterEach(async () => {
    try {
      await mongoose.connection.dropDatabase();
    } catch (err) {
      console.error(err);
    }
  });

  it('Should return requested exercise log (query)', async () => {
    const user = await User.create({ username: 'user1' });
    const exercise = await Exercise.create({
      userId: user._id,
      description: 'swimming',
      duration: 60,
      date: new Date('2010-04-01'),
    });

    const res = await chai.request(App)
      .get('/api/exercise/log/')
      .query({ userId: user._id });

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body._id).to.equal(user._id);
    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal(user.username);
    expect(res.body).to.have.property('log');
    expect(res.body.log).to.be.an('array');
    expect(res.body.log.length).to.deep.equal(1);
    expect(res.body.log[0].description).to.equal(exercise.description);
    expect(res.body.log[0].duration).to.equal(exercise.duration);
    expect(res.body.log[0].date).to.equal(exercise.date.toDateString());
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;
  });

  it('Should return requested exercise log (json)', async () => {
    const user = await User.create({ username: 'user1' });
    const exercise = await Exercise.create({
      userId: user._id,
      description: 'swimming',
      duration: 60,
      date: new Date('2010-04-01'),
    });

    const res = await chai.request(App)
      .get('/api/exercise/log/')
      .type('json')
      .send({ userId: user._id });

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body._id).to.equal(user._id);
    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal(user.username);
    expect(res.body).to.have.property('log');
    expect(res.body.log).to.be.an('array');
    expect(res.body.log.length).to.deep.equal(1);
    expect(res.body.log[0].description).to.equal(exercise.description);
    expect(res.body.log[0].duration).to.equal(exercise.duration);
    expect(res.body.log[0].date).to.equal(exercise.date.toDateString());
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;
  });

  it('Should return requested exercise log (form)', async () => {
    const user = await User.create({ username: 'user1' });
    const exercise = await Exercise.create({
      userId: user._id,
      description: 'swimming',
      duration: 60,
      date: new Date('2010-04-01'),
    });

    const res = await chai.request(App)
      .get('/api/exercise/log/')
      .type('form')
      .send({ userId: user._id });

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body._id).to.equal(user._id);
    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal(user.username);
    expect(res.body).to.have.property('log');
    expect(res.body.log).to.be.an('array');
    expect(res.body.log.length).to.deep.equal(1);
    expect(res.body.log[0].description).to.equal(exercise.description);
    expect(res.body.log[0].duration).to.equal(exercise.duration);
    expect(res.body.log[0].date).to.equal(exercise.date.toDateString());
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;
  });
});
