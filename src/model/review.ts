import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  book: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Book',
    require: true
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    require: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    inmutable: true
  }
});

export const Review = mongoose.model('Review', reviewSchema);
