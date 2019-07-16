/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import shortid, { isValid } from 'shortid';

import app from '../../../../server.js';
import User from '../../../../models/user.js';
import Exercise from '../../../../models/exercise.js';

chai.use(chaiHttp);

describe('Integration::add Route', () => {
  before(async () => {
    try {
      if (mongoose.connections.length > 0) {
        await mongoose.disconnect();
      }
      await mongoose.connect(process.env.MLAB_TEST_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
      });
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

  it('Should return new json exercise object (form)', async () => {
    const _id = shortid.generate();
    const username = 'user1';
    const description = 'swimming';
    const duration = 60;
    const dateString = '2010-04-27';
    const dateObject = new Date(dateString);

    await new User({ username, _id }).save();

    const res = await chai.request(app)
      .post('/api/exercise/add/')
      .type('form')
      .send({
        userId: _id,
        description,
        duration,
        date: dateString,
      });

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('username');
    expect(res.body).to.have.property('duration');
    expect(res.body).to.have.property('date');
    expect(res.body.username).to.equal(username);
    expect(res.body.description).to.equal(description);
    expect(res.body.duration).to.equal(duration);
    expect(res.body.date).to.equal(dateObject.toDateString());
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;
  });

  it('Should return new json exercise object (json)', async () => {
    const _id = shortid.generate();
    const username = 'user1';
    const description = 'swimming';
    const duration = 60;
    const dateString = '2010-04-27';
    const dateObject = new Date(dateString);

    await new User({ username, _id }).save();

    const res = await chai.request(app)
      .post('/api/exercise/add/')
      .type('json')
      .send({
        userId: _id,
        description,
        duration,
        date: dateString,
      });

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('username');
    expect(res.body).to.have.property('duration');
    expect(res.body).to.have.property('date');
    expect(res.body.username).to.equal(username);
    expect(res.body.description).to.equal(description);
    expect(res.body.duration).to.equal(duration);
    expect(res.body.date).to.equal(dateObject.toDateString());
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;
  });

  it('Should save new exercise object to mongo (form)', async () => {
    const _id = shortid.generate();
    const username = 'user1';
    const description = 'swimming';
    const duration = 60;
    const dateString = '2010-04-27';
    const dateObject = new Date(dateString);

    await new User({ username, _id }).save();

    await chai.request(app)
      .post('/api/exercise/add/')
      .type('form')
      .send({
        userId: _id,
        description,
        duration,
        date: dateString,
      });

    const exercise = await Exercise.findOne({
      userId: _id,
      description,
      duration,
      date: dateObject,
    });

    expect(exercise).to.not.be.null;
  });

  it('Should save new exercise object to mongo (json)', async () => {
    const _id = shortid.generate();
    const username = 'user1';
    const description = 'swimming';
    const duration = 60;
    const dateString = '2010-04-27';
    const dateObject = new Date(dateString);

    await new User({ username, _id }).save();

    await chai.request(app)
      .post('/api/exercise/add/')
      .type('json')
      .send({
        userId: _id,
        description,
        duration,
        date: dateString,
      });

    const exercise = await Exercise.findOne({
      userId: _id,
      description,
      duration,
      date: dateObject,
    });

    expect(exercise).to.not.be.null;
  });
});
