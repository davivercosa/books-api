// models imports
const BooksModel = require('../models/BooksModel');
const UsersModel = require('../models/UsersModel');

class BooksController {
  async create(req, res) {
    const { name, description, author, rate, releaseYear, encodedCoverImage } =
      req.body;

    if (name === undefined) {
      res.status(400);
      res.json({ message: 'O campo nome é obrigatório!' });
      return;
    }

    if (description === undefined) {
      res.status(400);
      res.json({ message: 'O campo descrição é obrigatório!' });
      return;
    }

    if (author === undefined) {
      res.status(400);
      res.json({ message: 'O campo autor é obrigatório!' });
      return;
    }

    if (rate === undefined) {
      res.status(400);
      res.json({ message: 'O campo nota é obrigatório!' });
      return;
    }

    if (releaseYear === undefined) {
      res.status(400);
      res.json({ message: 'O campo ano é obrigatório!' });
      return;
    }

    if (encodedCoverImage === undefined) {
      res.status(400);
      res.json({ message: 'O campo imagem é obrigatório!' });
      return;
    }

    if (typeof name !== 'string') {
      res.status(400);
      res.json({ message: 'O parâmetro nome deve ser do tipo string!' });
      return;
    }

    if (typeof description !== 'string') {
      res.status(400);
      res.json({ message: 'O parâmetro descrição deve ser do tipo string!' });
      return;
    }

    if (typeof author !== 'string') {
      res.status(400);
      res.json({ message: 'O parâmetro autor deve ser do tipo string!' });
      return;
    }

    if (typeof rate !== 'string') {
      res.status(400);
      res.json({ message: 'O parâmetro nota deve ser do tipo string!' });
      return;
    }

    if (typeof releaseYear !== 'string') {
      res.status(400);
      res.json({ message: 'O parâmetro ano deve ser do tipo string!' });
      return;
    }

    if (typeof encodedCoverImage !== 'string') {
      res.status(400);
      res.json({ message: 'O parâmetro imagem deve ser do tipo string!' });
      return;
    }

    const resp = await UsersModel.isEmailAlreadyRegistered(
      req.loggedUserEmail.email,
    );

    if (resp.user.role !== 1) {
      res.status(401);
      res.json({ message: 'Usuário sem permissão para executar ação!' });
      return;
    }

    const response = await BooksModel.isBooksAlreadyRegistered(name);

    if (response === true) {
      res.status(400);
      res.json({ message: `O livro '${name}' já consta na base de dados` });
      return;
    }

    const book = await BooksModel.storeCover(
      name,
      encodedCoverImage,
      resp.user.id,
    );

    const dbResp = await BooksModel.create(
      name,
      description,
      author,
      rate,
      releaseYear,
      book.filePath,
      resp.user.id,
    );

    if (dbResp.length === 0) {
      res.status(500);
      res.json({
        message:
          'Erro interno. Para mais detalhes, por favor, entre em contato com o suporte!',
      });
      return;
    }

    res.status(200);
    res.json({ message: 'Cadastro de livro realizado com sucesso!' });
  }

  async list(req, res) {
    const currentPage = req.params.page;

    if (currentPage === undefined) {
      res.status(400);
      res.json({ message: 'Parâmetro page não informado!' });
      return;
    }

    if (typeof currentPage !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro page deve ser do tipo string!' });
      return;
    }

    const booksList = await BooksModel.list(currentPage);

    if (booksList === false) {
      res.status(404);
      res.json({ message: 'Página não encontrada!' });
      return;
    }

    if (booksList.data.length === 0) {
      res.status(404);
      res.json({
        message:
          'Desculpe, no momento, estamos sem livros cadastrados na base de dados',
      });
      return;
    }

    const books = await BooksModel.bookCoverEncoderBase64(booksList.data);

    res.status(200);
    res.json({ books: books, pagination: booksList.pagination });
  }
}

module.exports = new BooksController();
