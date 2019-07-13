
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import {isValid} from 'shortid';

import {app} from '../../../../server.js';
import {User} from '../../../../models/user.js'

chai.use(chaiHttp);

describe('Integration::User Route', function() {
  
  before(async () => {
    try {
      await mongoose.connect(process.env.MLAB_TEST_URI, { useNewUrlParser: true,  useCreateIndex: true});
      await mongoose.connection.dropDatabase();
    } catch (err) {
      console.error(err);
    }
  });
 
  after((done) => {
    try {
      mongoose.disconnect();
      done();
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
  
  it('Should return json user object when called (param)', async () => {

    const user = await new User({username: 'user1'}).save();

    const res = await chai.request(app).get('/api/exercise/user/' + user._id);

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal('user1');
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;
  });

  it('Should return json user object when called (form)', async () => {
    
    const user = await new User({username: 'user1'}).save();

    const res = await chai.request(app).get('/api/exercise/user/').query({userId: user._id});

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal('user1');
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;

  });
  
  it('Should return json user object when called (json)', async () => {

    const user = await new User({username: 'user1'}).save();

    const res = await chai.request(app).get('/api/exercise/user/').send({_id: user._id});

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal('user1');
    expect(res.body).to.not.have.property('__v');
    expect(isValid(res.body._id)).to.be.true;

  });
  
});