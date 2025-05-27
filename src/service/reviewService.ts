import { Request, Response } from "express";
import { Book } from "../model/book";
import { User } from "../model/user";
import { Review } from "../model/review";

export async function submitReview(req: Request, res: Response) {
  try {
    const bookId = req.params.id;
    const userId = req.userId;

    const book = await Book.findById(bookId);
    if (!book || book === null) {
      res.status(404).json({error: 'Book not found'});
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(500).json({error: 'Fail to submit review for book'});
      return;
    }

    if (!await validateUserHasNoExistingReview(bookId, userId, res)) {
      return; 
    }

    const { comment, rating } = req.body;

    const review = new Review({comment: comment, rating: rating, book: bookId, user: userId});
    await review.save();
  
    const response = {
      id: review._id,
      comment: review.comment,
      rating: review.rating,
      user: user.username
    }

    res.status(200).json({response});
  } catch {
    res.status(500).json({error: 'Fail to submit review for book'});
  }
}

export async function updateReview(req: Request, res: Response) {
  try {
    const id =  req.params.id;

    if(!await validateUserOwnership(id, req, res)) {
      return;
    }

    const {comment, rating} = req.body;
    const updatedReview = await Review.findByIdAndUpdate(id, {$set: {comment: comment, rating: rating}}, {new: true})
      .populate('user', 'username');

    if(!updatedReview) {
      res.status(500).json({error: 'Fail to update review for book'});
      return;
    }
    
    const response = {
      id: updatedReview._id,
      comment: updatedReview.comment,
      rating: updatedReview.rating,
      user: (updatedReview.user as any).username
    }
    res.status(200).json({response});
  } catch {
    res.status(500).json({error: 'Fail to update review for book'});
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    if(!await validateUserOwnership(id, req, res)) {
      return;
    }

    await Review.findByIdAndDelete(id);
    
    res.status(200).json({"deleted_review": id});
  } catch {
    res.status(500).json({error: 'Fail to update review for book'});
  }
}

async function validateUserHasNoExistingReview(bookId: string, userId: string, res: Response) {
  const existingReview = await Review.findOne({book: bookId,user: userId});
  
  if (existingReview) {
    res.status(400).json({error: 'You have alreay review the book'});
    return false;
  }

  return true;
}

async function validateUserOwnership(reviewId: string, req: Request, res: Response) {
  const review = await Review.findById(reviewId);
    
  if (!review || review === null) {
    res.status(404).json({error: 'Review not found'});
    return false;
  }

  const ownerId = review.user?.toString();

  if (ownerId !== req.userId) {
    res.status(401).json({error: 'Access Forbidden'});
    return false;
  }

  return true;
}

