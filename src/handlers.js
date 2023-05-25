const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} =
    request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
  }

  if (readPage > pageCount) {
    return h
        .response({
          status: 'fail',
          message:
          'Gagal menambahkan buku. ' +
          'readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length === 1;

  if (isSuccess) {
    return h
        .response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        })
        .code(201);
  }

  return h
      .response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      })
      .code(500);
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (!name && !reading && !finished) {
    return h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }

  if (name == 'Dicoding') {
    return h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }

  if (reading) {
    const filteredReadingBook = books.filter((book) =>
      Number(book.reading) === Number(reading));

    return h.response({
      status: 'success',
      data: {
        books: filteredReadingBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }

  const filteredFinishedBook = books.filter((book) =>
    Number(book.finished) === Number(finished));

  return h.response({
    status: 'success',
    data: {
      books: filteredFinishedBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.find((book) => book.id === id);

  if (book) {
    return h
        .response({
          status: 'success',
          data: {book},
        })
        .code(200);
  }

  return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {name, year, author, summary, publisher, pageCount, readPage, reading} =
    request.payload;

  if (!name) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
  }

  if (readPage > pageCount) {
    return h
        .response({
          status: 'fail',
          message:
          'Gagal memperbarui buku. ' +
          'readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    return h
        .response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        })
        .code(200);
  }

  return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    return h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
  }

  return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
