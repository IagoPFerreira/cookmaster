# Boas vindas ao repositório do projeto Cookmaster

Esse projeto foi desenvolvido como projeto avaliativo no módulo de Backend, no curso de Desenvolvimento Web da [Trybe](https://www.betrybe.com/?utm_medium=cpc&utm_source=google&utm_campaign=Brand&utm_content=ad03_din_h), o objetivo desse projeto colocar em pratica meus conhecimentos em Node.js, fazendo o uso de tokens de autenticação, usar a biblioteca JWT, consultar arquivos do servidor através de uma api REST e realizar testes de integração.

---

# Sumário

- [Boas vindas ao repositório do projeto Cookmaster!](#boas-vindas-ao-repositório-do-projeto-cookmaster)
- [Estrutura de diretórios e arquivos](#Estrutura-de-diretórios-e-arquivos)
- [Instalação do projeto localmente](#Instalação-do-projeto-localmente)

---

## Estrutura de diretórios e arquivos

~~~ bash
.
├── .trybe
│   ├── requirements.json
├── .vscode
│   ├── settings.json
├── node_modules
├── public
├── src
│   ├── api
│   │   ├── app.js
│   │   └── server.js
│   ├── controllers
│   │   ├── recipesController.js
│   │   └── userController.js
│   ├── integration-tests
│   │   ├── connectionMock.js
│   │   ├── createUsers.test.js
│   │   ├── login.test.js
│   │   └── recipes.test.js
│   ├── middlewares
│   │   └── validateToken.js
│   ├── models
│   │   ├── connection.js
│   │   ├── recipesModel.js
│   │   └── userModel.js
│   ├── services
│   │   ├── recipesService.js
│   │   └── userService.js
│   └── uploads
├── test
│   ├── admin.test.js
│   ├── coverage.test.js
│   ├── recipes.test.js
│   └── users.test.js
├── uploads
├── .env
├── .eslintignore
├── .eslintrc.json
├── jest.config.js
├── nyc.config.js
├── package-lock.json
├── package.json
├── README.md
└── seed.js
~~~

⚠️ Por questões pessoais, eu resolvir deixar alguns diretórios e arquivos da estrutura original fornecida pela [Trybe](https://www.betrybe.com/?utm_medium=cpc&utm_source=google&utm_campaign=Brand&utm_content=ad03_din_h), para realização do projeto. ⚠️

---

## Desenvolvimento

Este projeto foi desenvolvido utilizando a arquitetura de camadas MSC.

Através dessa aplicação, é possível realizar as operações básicas que se pode fazer em um determinado banco de dados: Criação, Leitura, Atualização e Exclusão (ou `CRUD`).

Para realizar qualquer tipo de alteração no banco de dados (como cadastro, edição ou exclusão de receitas) será necessário autenticar-se.

A autenticação é feita via `JWT`.

## Instalação do projeto localmente

Após cada um dos passos, haverá um exemplo do comando a ser digitado para fazer o que está sendo pedido, caso tenha dificuldades e o exemplo não seja suficiente, não hesite em me contatar em *iago.pferreiravr@gmail.com*.

Passo 1. Abra o terminal e crie um duretório no local de sua preferência com o comando `mkdir`:

~~~bash
mkdir projetos-iago
~~~

Passo 2. Entre no diretório que você acabou de criar:

~~~bash
cd projetos-iago
~~~

Passo 3. Clone o projeto:

~~~bash
git clone git@github.com:IagoPFerreira/cookmaster.git
~~~

Passo 4. Após terminado a clonagem, entre no diretório que você acabou de clonar:

~~~bash
cd cookmaster
~~~

Passo 5. Instale todas as dependências do projeto:

~~~bash
npm install
~~~

Passo 6. Após a instalação das dependências, rode a aplicação

~~~bash
npm run dev
~~~

A aplicação começará a rodar e no seu terminal deve aparecer as seguintes mensagens:

![terminal](./images/terminal.png)

⚠️ **Atenção** ⚠️

Essa aplicação foi desenvolvida utilizando MongoDB, é necessário para o funcionamento correto desse projeto que o MongoDB esteja instalado na sua máquina, caso você não o tenha instalado, você pode seguir o passo a passo da [documentação do MongoDB para a instalação](https://docs.mongodb.com/manual/installation/).

---

## Utilizando as rotas

Localmente todas as rotas irão rodar na porta 3000, dito isso, no local onde você fará as requisições adicione a seguinte URL `http://localhost:3000` e depois adicione o endpoint ao qual deseja fazer a requisição, exemplo `http://localhost:3000/users`.

Voce pode usar as ferramentas [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), [Thunder Client](https://www.thunderclient.com/), dentre outras para fazer as requisições.

Caso haja algum erro nas requisições por falta de informação passada no corpo da requisição, ou informação passada da forma errada, as requisições irão retornar mensagens de erro descritivas de cada erro.

### POST /users

~~~http
http://localhost:3000/users
~~~

Esta é uma rota de cadastro de novos usuários, essa rota espera no corpo da requisição um JSON com as seguintes chaves:

~~~JSON
{
  "name": "teste",
  "email": "teste@email.com",
  "password": "teste"
}
~~~

E o retorno dessa requisição será:

~~~JSON
{
  "user": {
    "name": "teste",
    "email": "teste@email.com",
    "role": "user",
    "_id": "61facc97d9ed7540e7b9c1ee"
  }
}
~~~

---

### POST /login

~~~http
http://localhost:3000/login
~~~

Esta é uma rota de realização de login, essa rota espera no corpo da requisição um JSON com as seguintes chaves:

~~~JSON
{
  "email": "teste@email.com",
  "password": "teste"
}
~~~

E o retorno dessa requisição será:

~~~JSON
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZhY2M5N2Q5ZWQ3NTQwZTdiOWMxZWUiLCJuYW1lIjoidGVzdGUiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjQzODI2NzI0LCJleHAiOjE2NDM4Mjc2MjR9.JqDhvy0aMGiNLGZdKuXRJFAWzLeS0dCLn4pWjVcfAGk"
}
~~~

Este token será o token de validação de que deverá ser passado para outras requisições

---

### GET /recipes

~~~http
http://localhost:3000/recipes
~~~

Esta é uma rota de busca de todas as receitas cadastradas no banco de dados, essa rota não espera nada no corpo da requisição.

E o retorno dessa requisição será um array das receitas cadastradas:

~~~JSON
[
  {
    "_id": "61faacccde0dc470d098e844",
    "name": "string",
    "ingredients": "string",
    "preparation": "string"
  },
  {
    "_id": "61faacd4de0dc470d098e845",
    "name": "string",
    "ingredients": "string",
    "preparation": "string"
  },
  {
    "_id": "61fab004f2a5298b06477e84",
    "name": "string",
    "ingredients": "string",
    "preparation": "string"
  }
]
~~~

---

### GET recipes/:id

~~~http
http://localhost:3000/recipes/61fab004f2a5298b06477e84
~~~

Esta é uma rota de busca de uma receita cadastrada específica no banco de dados, essa rota não espera nada no corpo da requisição, mas espera o `_id` de uma receita específica, como parâmetro de rota.

E o retorno dessa requisição será um a receita cadastrada:

~~~JSON
{
  "_id": "61fab004f2a5298b06477e84",
  "name": "string",
  "ingredients": "string",
  "preparation": "string"
}
~~~

⚠️ **Este é um projeto que ainda está em desenvolvimento, há espaço para melhorias e novas implementações, ambas serão feitas com o tempo, caso você tenha alguma sugestão, envie-a para mim no meu e-mail *iago.pferreiravr@gmail.com*** ⚠️

---

## Link para o portfolio

Você pode ir ao meu portfolio e conferir os outros projetos que eu já desenvolvi

<https://iagopferreira.github.io/portfolio-react>
