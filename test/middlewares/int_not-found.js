/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../server.js';

chai.use(chaiHttp);

describe('Integration::not-found Middleware', () => {
  it('Should give a not found response if none of the routers picks up the request', async () => {
    const res = await chai.request(app)
      .get('/api/exercise/very-random-stuff-that-wont-ever-exist/');

    expect(res).to.have.status(404);
    expect(res).to.be.text;
    expect(res.text).to.equal('not found');
  });
});
