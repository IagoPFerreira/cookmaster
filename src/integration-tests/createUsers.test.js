const chai = require('chai');
const chaiHTTP = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const server = require('../api/app');
const { getConnection } = require('./connectionMock');

chai.use(chaiHTTP);

const { expect } = chai;

describe('POST /users', () => {
  let db;

  before(async () => {
    const connectionMock = await getConnection();

    db = connectionMock.db('Cookmaster');

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Casos de falha', () => {
    describe('Quando não é passado o campo "name"', () => {
      let response;

      before(async () => {
        response = await chai.request(server)
          .post('/users')
          .send({
            email: 'teste@teste.com',
            password: '123456789'
          });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
        expect(response.body.message).to.be.equal('Invalid entries. Try again.');
      });
    });

    describe('Quando não é passado o campo "email"', () => {
      let response;

      before(async () => {
        response = await chai.request(server)
          .post('/users')
          .send({
            name: 'Testador Testante',
            password: '123456789'
          });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
        expect(response.body.message).to.be.equal('Invalid entries. Try again.');
      });
    });

    describe('Quando não é passado um e-mail válido no campo "email"', () => {
      let response;

      before(async () => {
        response = await chai.request(server)
          .post('/users')
          .send({
            name: 'Testador Testante',
            email: 'testatortestante@',
            password: '123456789'
          });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
        expect(response.body.message).to.be.equal('Invalid entries. Try again.');
      });
    });

    describe('Quando não é passado o campo "password"', () => {
      let response;

      before(async () => {
        response = await chai.request(server)
          .post('/users')
          .send({
            name: 'Testador Testante',
            email: 'testatortestante@',
            password: '123456789'
          });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
        expect(response.body.message).to.be.equal('Invalid entries. Try again.');
      });
    });

    describe('Quando o e-mail passado não é único', () => {
      let response;

      before(async () => {
        await chai.request(server)
          .post('/users')
          .send({
            name: 'Testador Testante',
            email: 'testatortestante@teste.com',
            password: '123456789'
          });

        response = await chai.request(server)
          .post('/users')
          .send({
            name: 'Testador Testante',
            email: 'testatortestante@teste.com',
            password: '123456789'
          });
      });

      after(async () => {
        db.collection('users').deleteMany({
          name: 'Testador Testante',
          email: 'testatortestante@teste.com',
          password: '123456789'
        })
      })

      it('retorna o código de status 409', () => {
        expect(response).to.have.status(409);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
        expect(response.body.message).to.be.equal('Email already registered');
      });
    });
  });

  describe('Casos de sucesso', () => {
    
  });
});
