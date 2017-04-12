import { expect } from 'chai';
import should from 'should';
import supertest from 'supertest';
import db from '../models/index';
import testData from './data.spec';
import server from '../../app';

const app = supertest(server);

export {
  app,
  should,
  expect,
  db,
  testData
};
