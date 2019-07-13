import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import {isValid} from 'shortid';

import {app} from '../../../../server.js';
import {User} from '../../../../models/user.js'

chai.use(chaiHttp);

describe('Integration::Users Route', () => {
  
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
    
  it('Should return json list of user objects', async () => {
    
    const user = await new User({username: 'user1'}).save();
    
    const res = await chai.request(app).get('/api/exercise/users');
      
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('username');
      expect(res.body[0].username).to.equal('user1');
      expect(res.body[0]).to.not.have.property('__v');
      expect(isValid(res.body[0]._id)).to.be.true;
    
  });
});