import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  },
  genre: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true,
    min: 0
  }
});

export const Book = mongoose.model('Book', bookSchema);
