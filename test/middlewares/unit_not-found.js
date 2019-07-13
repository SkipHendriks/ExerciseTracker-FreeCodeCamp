import chai, {expect} from 'chai';
import sinon from 'sinon';

import {notFoundHandler} from '../../middlewares/not-found.js'

describe('Unit::not-found Middleware', function() {
  describe('notFoundHandler() function', function() {
 
    afterEach(() => {
      sinon.restore();
    });
    
    it('Should forward to next with not found error', async () => {
      const next = sinon.spy();
      await notFoundHandler(null, null, next);
            
      expect(next.callCount).to.deep.equal(1);
      expect(next.firstCall.args[0].status).to.deep.equal(404);
      expect(next.firstCall.args[0].message).to.equal("not found");
    });
  });
});
