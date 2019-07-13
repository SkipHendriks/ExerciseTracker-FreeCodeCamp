import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {errorHandler} from '../../middlewares/error-handler.js'

chai.use(sinonChai);

describe('Unit::error-handler Middleware', function() {
  describe('errorHandler() function', function() {
 
    afterEach(() => {
      sinon.restore();
    });
    
    it('Should send first validation error message', async () => {
      
      const err = {errors:
                    { userId:
                      { message: 'Validator "required" failed for path name',
                        name: 'ValidatorError',
                        path: 'name',
                        type: 'required' },
                     duration: 
                      { message: 'Validator "required" failed for path duration',
                        name: 'ValidatorError',
                        path: 'name',
                        type: 'required' },
                    }
                  };
      
      const res = {
        status: sinon.spy(),
        type: sinon.spy(),
        send: sinon.spy()
      }
           
      const next = sinon.spy();
      
      await errorHandler(err, null, res, next);
            
      expect(next).to.have.callCount(0);
      
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(400);
      
      expect(res.type).to.have.been.calledOnce;
      expect(res.type).to.have.been.calledWith('txt');
      
      expect(res.send).to.have.been.calledOnce;
      expect(res.send).to.have.been.calledWith(err.errors.userId.message);
      
      // send should be called last
      expect(res.send).to.be.calledAfter(res.status);
      expect(res.send).to.be.calledAfter(res.type);

    });
    
    it('Should send default error message when generic error is provided', async () => {
      
      const err = new Error();
      
      const res = {
        status: sinon.spy(),
        type: sinon.spy(),
        send: sinon.spy()
      }
           
      const next = sinon.spy();
      
      await errorHandler(err, null, res, next);
            
      expect(next).to.have.callCount(0);
      
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(500);
      
      expect(res.type).to.have.been.calledOnce;
      expect(res.type).to.have.been.calledWith('txt');
      
      expect(res.send).to.have.been.calledOnce;
      expect(res.send).to.have.been.calledWith('Internal Server Error');
      
      // send should be called last
      expect(res.send).to.be.calledAfter(res.status);
      expect(res.send).to.be.calledAfter(res.type);

    });
    
    it('Should send specific error message when specific error is provided', async () => {
      
      const err = {status: 404, message: 'not found'};
      
      const res = {
        status: sinon.spy(),
        type: sinon.spy(),
        send: sinon.spy()
      }
           
      const next = sinon.spy();
      
      await errorHandler(err, null, res, next);
            
      expect(next).to.have.callCount(0);
      
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(err.status);
      
      expect(res.type).to.have.been.calledOnce;
      expect(res.type).to.have.been.calledWith('txt');
      
      expect(res.send).to.have.been.calledOnce;
      expect(res.send).to.have.been.calledWith(err.message);
      
      // send should be called last
      expect(res.send).to.be.calledAfter(res.status);
      expect(res.send).to.be.calledAfter(res.type);

    });
  });
});
