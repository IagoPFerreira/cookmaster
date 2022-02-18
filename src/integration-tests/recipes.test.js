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
      
      await chai
        .request(server)
        .post('/recipes')
        .set({ authorization: token })
        .send({
          name: 'Frango' ,
          ingredients: 'Frango, sazon',
          preparation: '10 minutos no forno',
        });
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

    describe('Quando é possível listar todas as receitas sem estar autenticado', () => {
      let response;

      before(async () => {
        response = await chai
          .request(server)
          .get('/recipes');
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('a propriedade "body" é um array', () => {
        expect(response.body).to.be.a('array')
      });

      it('o item no array ter as informações da receita', () => {
        expect(response.body[0].name).to.be.equal('Frango');
        expect(response.body[0].ingredients).to.be.equal('Frango, sazon');
        expect(response.body[0].preparation).to.be.equal('10 minutos no forno');
        expect(response.body[0]).to.have.property('_id');
      });

    });

    describe('Quando é possível listar todas as receitas estando autenticado', () => {
      let response;

      before(async () => {
        response = await chai
          .request(server)
          .get('/recipes');
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('a propriedade "body" é um array', () => {
        expect(response.body).to.be.a('array')
      });

      it('o item no array ter as informações da receita', () => {
        expect(response.body[0].name).to.be.equal('Frango');
        expect(response.body[0].ingredients).to.be.equal('Frango, sazon');
        expect(response.body[0].preparation).to.be.equal('10 minutos no forno');
        expect(response.body[0]).to.have.property('_id');
      });

    });
  });
});

describe('GET /recipes/:id', () => {
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

    describe('Quando não existem receitas cadastradas com esse id', () => {
      let response;
      const id = '61faacccde0dc470d098e744'

      before(async () => {
        response = await chai
        .request(server)
        .get(`/recipes/${id}`);
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

      it('a propriedade "message" possui o texto "recipe not found"', () => {
        expect(response.body.message).to.be.equal(
          'recipe not found'
        );
      });
    });

    describe('Quando o id não é um id válido', () => {
      let response;
      const id = '61faacccde0dc470d098e74*'

      before(async () => {
        response = await chai
        .request(server)
        .get(`/recipes/${id}`);
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

      it('a propriedade "message" possui o texto "invalid id"', () => {
        expect(response.body.message).to.be.equal(
          'invalid id'
        );
      });
    });
  });

  describe('Casos de sucesso', () => {

    let token;
    let recipeId;

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

      recipeId = await chai
      .request(server)
      .post('/recipes')
      .set({ authorization: token })
      .send({
        name: 'Frango' ,
        ingredients: 'Frango, sazon',
        preparation: '10 minutos no forno',
      })
      .then(({ body: { recipe } }) => recipe._id);
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

    describe('Quando é possível listar todas as receitas sem estar autenticado', () => {
      let response;

      before(async () => {
        response = await chai
          .request(server)
          .get(`/recipes/${recipeId}`);
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('a propriedade "body" é um objeto', () => {
        expect(response.body).to.be.a('object')
      });

      it('a propriedade "body" ter as informações da receita', () => {
        expect(response.body.name).to.be.equal('Frango');
        expect(response.body.ingredients).to.be.equal('Frango, sazon');
        expect(response.body.preparation).to.be.equal('10 minutos no forno');
        expect(response.body).to.have.property('_id');
      });

    });

    describe('Quando é possível listar todas as receitas estando autenticado', () => {
      let response;

      before(async () => {
        response = await chai
          .request(server)
          .get(`/recipes/${recipeId}`);
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('a propriedade "body" é um objeto', () => {
        expect(response.body).to.be.a('object')
      });

      it('a propriedade "body" ter as informações da receita', () => {
        expect(response.body.name).to.be.equal('Frango');
        expect(response.body.ingredients).to.be.equal('Frango, sazon');
        expect(response.body.preparation).to.be.equal('10 minutos no forno');
        expect(response.body).to.have.property('_id');
      });

    });
  
  });
});

describe('PUT /recipes/:id', () => {
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
    let recipeId;

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

        recipeId = await chai
        .request(server)
        .post('/recipes')
        .set({ authorization: token })
        .send({
          name: 'Frango' ,
          ingredients: 'Frango, sazon',
          preparation: '10 minutos no forno',
        })
        .then(({ body: { recipe } }) => recipe._id);
    });

    after(async () => {
      db.collection('users').deleteMany({
        name: 'Yarpen Zigrin',
        email: 'yarpenzigrin@anao.com',
        password: '123456789'
      })
    })

    describe('Quando não é passado o token', () => {
      let response;

      before(async () => {
        response = await chai
        .request(server)
        .put(`/recipes/${recipeId}`)
        .send({
          name: 'Frango' ,
          ingredients: 'Frango, sazon',
          preparation: '10 minutos no forno',
        });
      });

      it('retorna o código de status 404', () => {
        expect(response).to.have.status(401);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "missing auth token"', () => {
        expect(response.body.message).to.be.equal(
          'missing auth token'
        );
      });
    });

    describe('Quando não é passado um token válido', () => {
      let response;
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV.eyJfaWQiOiI2MTgzMTA5NDYzNWMzYjdhYWMyZTA3ZjgiLCJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImV0ZXNAZW1haWwuY29tIiwicm9sZSI6ImFkbWluIiwidXNlcklkIjoiNjE4MzEwOTQ2MzVjM2I3YWFjMmUwN2Y3IiwiaWF0IjoxNjQ1MTkwODM1LCJleHAiOjE2NDUxOTE3MzV9.krA04NDvT10TuTDe64FohT-bzhaJIbVVDvA2MZTpUlE'

      before(async () => {
        response = await chai
        .request(server)
        .put(`/recipes/${recipeId}`)
        .set({ authorization: fakeToken })
        .send({
          name: 'Frango' ,
          ingredients: 'Frango, sazon',
          preparation: '10 minutos no forno',
        });
      });

      it('retorna o código de status 404', () => {
        expect(response).to.have.status(401);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('a propriedade "message" possui o texto "jwt malformed"', () => {
        expect(response.body.message).to.be.equal(
          'jwt malformed'
        );
      });
    });

    describe('Quando o id não é um id válido', () => {
      let response;
      const id = '61faacccde0dc470d098e74*'

      before(async () => {
        response = await chai
        .request(server)
        .get(`/recipes/${id}`);
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

      it('a propriedade "message" possui o texto "invalid id"', () => {
        expect(response.body.message).to.be.equal(
          'invalid id'
        );
      });
    });
  });

  describe('Casos de sucesso', () => {

    let token;
    let recipeId;

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

      recipeId = await chai
      .request(server)
      .post('/recipes')
      .set({ authorization: token })
      .send({
        name: 'Frango',
        ingredients: 'Frango, sazon',
        preparation: '10 minutos no forno',
      })
      .then(({ body: { recipe } }) => recipe._id);
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

    describe('Quando é possível editar a receita estando autenticado', () => {
      let response;

      before(async () => {
        response = await chai
          .request(server)
          .put(`/recipes/${recipeId}`)
          .set({ authorization: token })
          .send({
            name: 'Frango com sazon',
            ingredients: 'Frango, sazon',
            preparation: '10 minutos no forno',
          });
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('a propriedade "body" é um objeto', () => {
        expect(response.body).to.be.a('object')
      });

      it('a propriedade "body" ter as informações da receita', () => {
        expect(response.body.name).to.be.equal('Frango com sazon');
        expect(response.body.ingredients).to.be.equal('Frango, sazon');
        expect(response.body.preparation).to.be.equal('10 minutos no forno');
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('userId');
      });
    });
  });
});

describe('DELETE /recipes/:id', () => {
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