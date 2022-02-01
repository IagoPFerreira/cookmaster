const chai = require('chai');
const chaiHTTP = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const server = require('../api/app');
const { getConnection } = require('./connectionMock');

chai.use(chaiHTTP);

const { expect } = chai;

describe('POST /recipes', () => {
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
    let token;

    before(async () => {
      await chai.request(server).post('/users').send({
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
    });

    after(async () => {
      db.collection('users').deleteMany({
        name: 'Yarpen Zigrin',
        email: 'yarpenzigrin@anao.com',
        password: '123456789'
      })
    })

    describe('Quando não é passado o campo "name"', () => {
      let response;

      before(async () => {
        response = await chai
        .request(server)
        .post('/recipes')
        .set({ authorization: token })
        .send({
          ingredients: 'Frango, sazon',
          preparation: '10 minutos no forno',
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
        expect(response.body.message).to.be.equal(
          'Invalid entries. Try again.'
        );
      });
    });

    describe('Quando não é passado o campo "ingredients"', () => {
      let response;

      before(async () => {
        response = await chai
        .request(server)
        .post('/recipes')
        .set({ authorization: token })
        .send({
          name: 'Frango',
          preparation: '10 minutos no forno',
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
        expect(response.body.message).to.be.equal(
          'Invalid entries. Try again.'
        );
      });
    });

    describe('Quando não é passado o campo "preparation"', () => {
      let response;

      before(async () => {
        response = await chai
        .request(server)
        .post('/recipes')
        .set({ authorization: token })
        .send({
          name: 'Frango',
          ingredients: 'Frango, sazon',
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
        expect(response.body.message).to.be.equal(
          'Invalid entries. Try again.'
        );
      });
    });
  });

  describe('Casos de sucesso', () => {
    let token;

    before(async () => {
      await chai.request(server).post('/users').send({
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
    });

    after(async () => {
      db.collection('users').deleteMany({
        name: 'Yarpen Zigrin',
        email: 'yarpenzigrin@anao.com',
        password: '123456789'
      })

      db.collection('recipes').deleteMany({
        name: 'Frango' ,
        ingredients: 'Frango, sazon',
        preparation: '10 minutos no forno',
      })
    })

    describe('Quando é feito o cadastro da receita', () => {
      let response;

      before(async () => {
        response = await chai
          .request(server)
          .post('/recipes')
          .set({ authorization: token })
          .send({
            name: 'Frango' ,
            ingredients: 'Frango, sazon',
            preparation: '10 minutos no forno',
          });
      });

      it('retorna o código de status 201', () => {
        expect(response).to.have.status(201);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('a propriedade "recipe" é um objeto', () => {
        expect(response.body.recipe).to.be.a('object')
      });

      it('a propriedade "recipe" ter as informações da receita', () => {
        expect(response.body.recipe.name).to.be.equal('Frango');
        expect(response.body.recipe.ingredients).to.be.equal('Frango, sazon');
        expect(response.body.recipe.preparation).to.be.equal('10 minutos no forno');
        expect(response.body.recipe).to.have.property('_id');
      });

    });
  });
});

describe('GET /recipes', () => {
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
    let token;

    before(async () => {
      await chai.request(server).post('/users').send({
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
    });

    after(async () => {
      db.collection('users').deleteMany({
        name: 'Yarpen Zigrin',
        email: 'yarpenzigrin@anao.com',
        password: '123456789'
      })
    })

    describe('Quando não existem receitas cadastradas', () => {
      let response;

      before(async () => {
        response = await chai
        .request(server)
        .get('/recipes');
      });

      it('retorna o código de status 404', () => {
        expect(response).to.have.status(404);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "No registered recipe."', () => {
        expect(response.body.message).to.be.equal(
          'No registered recipe.'
        );
      });
    });
  });

  describe('Casos de sucesso', () => {});
});