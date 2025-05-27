import { Request, Response } from "express";
import { Book } from "../model/book";
import { Review } from "../model/review";

export async function addBook(req: Request, res: Response) {
  try {
    const {title, description, author, genre, price} = req.body;
    const book = new Book({title: title, description: description, author: author, genre: genre, price: price, reviews: []});
    await book.save();

    const response = {
      id: book.id,
      title: book.title, 
      description: book.description, 
      author: book.author,
      genre: book.genre,
      price: book.price
    }

    res.status(201).json(response);
  } catch {
    res.status(500).json({error: 'Fail to add new book'});
  }
}

export async function getBooks(req: Request, res: Response) {
  try {
    const {author, genre} = req.query;
    
    const filter: any = {};

    if (author) {
      filter.author = {$regex: author, $options: 'i'};
    }

    if (genre) {
      filter.genre = {$regex: genre, $options: 'i'};
    }

    const page = req.query.page? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit? parseInt(req.query.limit as string) : 10;

    const startIndex = (page - 1) * limit;
    const totalBooks = await Book.countDocuments();
    
    const books = await Book.find(filter).skip(startIndex).limit(limit);
    const data = books.map(book => {
      return {
        id: book.id,
        title: book.title, 
        description: book.description, 
        author: book.author,
        genre: book.genre,
        price: book.price
      }
    });

    const response = {
      page: page,
      limit: limit,
      totalBooks: totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      data: data
    }

    res.status(200).json(response);
  } catch {
    res.status(500).json({error: 'Fail to fetch books'});
  }
}

export async function getBook(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);
    if (!book || book === null) {
      res.status(404).json({error: 'Book not found'});
      return;
    }

    const page = req.query.reviewPage? parseInt(req.query.reviewPage as string) : 1;
    const limit = req.query.reviewLimit? parseInt(req.query.reviewLimit as string) : 10;

    const startIndex = (page - 1) * limit;
    const totalReviews = await Review.countDocuments({book: id});

    const reviews = await Review.find({book: id}).populate('user', 'username').skip(startIndex).limit(limit);
    const averageRaiting = (reviews.reduce((acc, val) => acc + val.rating, 0) / reviews.length).toFixed(1);

    const response = {
      id: book.id,
      title: book.title, 
      description: book.description, 
      author: book.author,
      genre: book.genre,
      price: book.price,
      averageRaiting: isNaN(parseInt(averageRaiting)) ? 0 : averageRaiting,
      reviews: {
        page: page,
        limit: limit,
        totalReviews: totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
        data: reviews.map(r => {
          return {
            id: r._id,
            comment: r.comment,
            raiting: r.rating,
            user: (r.user as any).username ?? null
          }
        })
      }
    }
    
    res.status(200).json(response);
  } catch {
    res.status(500).json({error: 'Fail to fetch book by id'});
  }
}

