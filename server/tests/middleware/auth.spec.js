/* eslint no-unused-expressions: 0 */
/* eslint no-underscore-dangle: 0 */

import httpMocks from 'node-mocks-http';
import events from 'events';
import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../../app';
import db from '../../models/index';
import testData from '../../tests/data.spec';
import Auth from '../../middlewares/auth';

const server = supertest.agent(app);
let adminToken;
let regularUserToken;
let request;

const responseEvent = () => httpMocks
  .createResponse({ eventEmitter: events.EventEmitter });

describe('Middleware Unit Test', () => {
  before((done) => {
    db.Role.create(testData.adminRole)
      .then(() => db.Role.create(testData.regularRole))
      .then(() => {
        testData.adminUser.roleId = 1;
        return db.User.create(testData.adminUser);
      })
      .then(() => db.User.create(testData.testUser))
      .then(() => server.post('/api/v1/users/login').send({
        username: testData.adminUser.username,
        password: testData.adminUser.password
      }))
      .then((res) => {
        adminToken = res.body.token;
      })
      .then(() => server.post('/api/v1/users/login').send({
        username: testData.testUser.username,
        password: testData.testUser.password
      }))
      .then((res) => {
        regularUserToken = res.body.token;
      })
      .then(() => {
        done();
      });
  });

  after(() => db.sequelize.sync({ force: true }));

  describe('Verify Token', () => {
    it('Should continue if token is valid', (done) => {
      const response = httpMocks.createResponse();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/users',
        headers: { 'X-ACCESS-TOKEN': adminToken }
      });
      const middlewareStub = {
        callback: () => { }
      };
      sinon.spy(middlewareStub, 'callback');
      Auth.verifyToken(request, response, middlewareStub.callback);
      expect(middlewareStub.callback).to.have.been.called;
      done();
    });

    it('Should not continue if token is invalid', (done) => {
      const response = responseEvent();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/users',
        headers: { 'X-ACCESS-TOKEN': 'invalidtoken' }
      });
      const middlewareStub = {
        callback: () => { }
      };
      sinon.spy(middlewareStub, 'callback');
      Auth.verifyToken(request, response, middlewareStub.callback);
      response.on('end', () => {
        expect(response.statusCode).to.equal(401);
        done();
      });
    });
  });

  describe('Admin Access', () => {
    it('Should not continue when requester is not an admin', (done) => {
      const response = responseEvent();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/roles',
        headers: { 'X-ACCESS-TOKEN': regularUserToken },
        decoded: { RoleId: 2 }
      });
      const middlewareStub = {
        callback: () => { }
      };
      sinon.spy(middlewareStub, 'callback');
      Auth.verifyAdmin(request, response, middlewareStub.callback);
      response.on('end', () => {
        expect(response.statusCode).to.equal(403);
        done();
      });
    });

    it('Should continue for admin user', (done) => {
      const response = responseEvent();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/roles',
        headers: { 'X-ACCESS-TOKEN': adminToken },
        decoded: { RoleId: 1 }
      });
      const middlewareStub = {
        callback: () => {}
      };
      sinon.spy(middlewareStub, 'callback');
      Auth.verifyAdmin(request, response, middlewareStub.callback);
      expect(middlewareStub.callback).to.have.been.called;
      done();
    });
  });
});

