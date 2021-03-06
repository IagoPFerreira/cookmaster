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
        response = await chai
          .request(server)
          .post('/users')
          .send({
            email: 'yarpenzigrin@anao.com',
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
        response = await chai
          .request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
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
        response = await chai
          .request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@',
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
        response = await chai
          .request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com'
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
        await chai
          .request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com',
            password: '123456789'
          });

        response = await chai
          .request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com',
            password: '123456789'
          });
      });

      after(async () => {
        db.collection('users').deleteMany({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
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

      it('a propriedade "message" possui o texto "Email already registered"', () => {
        expect(response.body.message).to.be.equal('Email already registered');
      });
    });
  });

  describe('Casos de sucesso', () => {
    describe('É possivel cadastrar um usuário', () => {
      let response;

      before(async () => {
        response = await chai
          .request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com',
            password: '123456789'
          });
      });

      after(async () => {
        db.collection('users').deleteMany({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789'
        });
      });

      it('retorna o código de status 201', () => {
        expect(response).to.have.status(201);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "user"', () => {
        expect(response.body).to.have.property('user');
      });

      it('a propriedade "user" é um objeto', () => {
        expect(response.body.user).to.be.a('object');
      });

      it('a propriedade "user" ter as informações do usuário', () => {
        expect(response.body.user.name).to.be.equal('Yarpen Zigrin');
        expect(response.body.user.email).to.be.equal('yarpenzigrin@anao.com');
        expect(response.body.user).to.have.property('_id');
        expect(response.body.user).to.have.property('role');
      });

      it('a propriedade "role" ter o valor user', () => {
        expect(response.body.user).to.have.property('role');
        expect(response.body.user.role).to.be.equal('user');
      });
    });
  });
});

describe('POST /users/admin', () => {
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
            name: 'Yarpen Zigrin',
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
            name: 'Yarpen Zigrin',
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
            name: 'Yarpen Zigrin',
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
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com',
            password: '123456789'
          });

        response = await chai.request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com',
            password: '123456789'
          });
      });

      after(async () => {
        db.collection('users').deleteMany({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
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

      it('a propriedade "message" possui o texto "Email already registered"', () => {
        expect(response.body.message).to.be.equal('Email already registered');
      });
    });

    describe('Quando o "role", de quem está tentando criar um novo "admin", não é "admin"', () => {
      let response;
      let token;

      before(async () => {
        await chai
          .request(server)
          .post('/users')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com',
            password: '123456789',
          });
  
        token = await chai
          .request(server)
          .post('/login')
          .send({
            name: 'Yarpen Zigrin',
            email: 'yarpenzigrin@anao.com',
            password: '123456789',
          })
          .then(({ body }) => body.token);

          response = await chai
            .request(server)
            .post('/users/admin')
            .set({ authorization: token })
            .send({
              name: 'Yarpen Zigrin Jr',
              email: 'yarpenzigrinjr@anao.com',
              password: '123456789',
            });
      });

      after(async () => {
        db.collection('users').deleteMany({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
      })

      it('retorna o código de status 403', () => {
        expect(response).to.have.status(403);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "Only admins can register new admins"', () => {
        expect(response.body.message).to.be.equal('Only admins can register new admins');
      });
    });
  });

  describe('Casos de sucesso', () => {
    describe('É possivel cadastrar um administrador', () => {
      let response;
      let token;

      before(async () => {
        const user =
          { name: 'Yarpen Zigrin Sr', email: 'yarpenzigrinsr@anao.com', password: '123456789', role: 'admin' };
        await db.collection('users').insertOne(user);

        token = await chai
          .request(server)
          .post('/login')
          .send({
            name: 'Yarpen Zigrin Sr',
            email: 'yarpenzigrinsr@anao.com',
            password: '123456789',
          })
          .then(({ body }) => body.token);

          response = await chai
            .request(server)
            .post('/users/admin')
            .set({ authorization: token })
            .send({
              name: 'Yarpen Zigrin Jr',
              email: 'yarpenzigrinjr@anao.com',
              password: '123456789',
            });
      });

      after(async () => {
        db.collection('users').deleteMany({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789'
        });
        db.collection('users').deleteMany({
          name: 'Yarpen Zigrin Sr',
          email: 'yarpenzigrinsr@anao.com',
          password: '123456789'
        });
      });

      it('retorna o código de status 201', () => {
        expect(response).to.have.status(201);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "user"', () => {
        expect(response.body).to.have.property('user');
      });

      it('a propriedade "user" é um objeto', () => {
        expect(response.body.user).to.be.a('object');
      });

      it('a propriedade "user" ter as informações do usuário', () => {
        expect(response.body.user.name).to.be.equal('Yarpen Zigrin Jr');
        expect(response.body.user.email).to.be.equal('yarpenzigrinjr@anao.com');
        expect(response.body.user).to.have.property('_id');
        expect(response.body.user).to.have.property('role');
      });

      it('a propriedade "role" ter o valor "admin"', () => {
        expect(response.body.user).to.have.property('role');
        expect(response.body.user.role).to.be.equal('admin');
      });
    });
  });
});
