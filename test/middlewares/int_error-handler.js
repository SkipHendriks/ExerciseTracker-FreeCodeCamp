
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

import {app} from '../../server.js';
import {User} from '../../models/user.js'

chai.use(chaiHttp);

describe('Integration::error-handler Middleware', function() {
  
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
  
  
  // only checking whether errors get forwarded correctly
  // the unit tests cover specific errors
  it('Should handle errors and respond with plain text message', async () => {

    await new User({username: 'user1'}).save();
        
    
    const res = await chai.request(app)
                          .post('/api/exercise/new-user/')
                          .type('form')
                          .send({username: ''});

    expect(res).to.have.status(400);
    expect(res).to.be.text;
    expect(res.text).to.equal('Username undefined');
  });
  
});