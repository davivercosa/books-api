// database connection import
const db = require('../database/connection');

// libs and services imports
const fs = require('fs');

class BooksModel {
  async isBooksAlreadyRegistered(name) {
    try {
      const book = await db('books').select('*').where({ name: name });

      if (book.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async storeCover(name, encodedCoverImage, userId) {
    try {
      const filePath = `${process.cwd()}/assets/coverImage/${userId}/${name}.png`;

      const doesDirectoryExist = fs.existsSync(
        `${process.cwd()}/assets/coverImage/${userId}`,
      );

      if (doesDirectoryExist === false) {
        fs.mkdir(`${process.cwd()}/assets/coverImage/${userId}`, (error) => {
          console.log(error);
        });
      }

      const buff = Buffer.from(encodedCoverImage, 'base64');

      fs.writeFileSync(filePath, buff, (error) => {
        console.log(error);
      });

      return { filePath: filePath };
    } catch (error) {
      console.log(error);
    }
  }

  async bookCoverEncoderBase64(books) {
    books.forEach((book) => {
      const base64Image = fs.readFileSync(book.cover_path, 'base64');

      book.cover_path = base64Image;
    });

    return books;
  }

  async create(
    name,
    description,
    author,
    rate,
    releaseYear,
    cover_path,
    userId,
  ) {
    try {
      const bookId = await db('books').insert({
        name: name,
        description: description,
        author: author,
        rate: rate,
        release_year: releaseYear,
        cover_path: cover_path,
        user_id: userId,
      });

      return bookId;
    } catch (error) {
      console.log(error);
    }
  }

  async list(currentPage) {
    try {
      const books = await db('books').paginate({
        perPage: 5,
        currentPage: Number(currentPage),
      });

      // console.log(books);

      if (books.pagination.from - books.pagination.to === 0) {
        return false;
      }

      return books;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new BooksModel();
