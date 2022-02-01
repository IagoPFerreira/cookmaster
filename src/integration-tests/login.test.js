const chai = require('chai');
const chaiHTTP = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const server = require('../api/app');
const { getConnection } = require('./connectionMock');

chai.use(chaiHTTP);

const { expect } = chai;

describe('POST /login', () => {
  let db;

  before(async () => {
    const connectionMock = await getConnection();

    db = connectionMock.db('Cookmaster');

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Casos de falha', () => {});

  describe('Casos de sucesso', () => {});
});
