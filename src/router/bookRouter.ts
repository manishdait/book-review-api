import router from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { addBook, getBook, getBooks } from '../service/bookService';
import { submitReview } from '../service/reviewService';

const bookRouter = router()

bookRouter.post('/', authMiddleware, addBook);
bookRouter.post('/:id/reviews', authMiddleware, submitReview);
bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBook);

export default bookRouter;
