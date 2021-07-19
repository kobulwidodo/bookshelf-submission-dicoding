const { nanoid } = require('nanoid');
const book = require('./book');

const addNewBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const dataBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  book.push(dataBook);
  const isSuccess = book.filter((data) => data.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let bookShow = book.map((n) => ({ id: n.id, name: n.name, publisher: n.publisher }));

  if (name !== undefined) {
    bookShow = bookShow.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: bookShow,
      },
    });
    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    bookShow = book.filter((n) => n.reading === Boolean(reading));
    bookShow = bookShow.map((n) => ({ id: n.id, name: n.name, publisher: n.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: bookShow,
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    bookShow = book.filter((n) => n.finished === (finished === '1'));
    bookShow = bookShow.map((n) => ({ id: n.id, name: n.name, publisher: n.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: bookShow,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookShow,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const dataBook = book.filter((n) => n.id === bookId)[0];
  if (dataBook !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: dataBook,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const putBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = book.findIndex((note) => note.id === bookId);
  if (index < 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const finished = (pageCount === readPage);
  const updatedAt = new Date().toISOString();
  book[index] = {
    ...book[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = book.findIndex((n) => n.id === bookId);
  if (index < 0) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  book.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addNewBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  putBookByIdHandler,
  deleteBookByIdHandler,
};
