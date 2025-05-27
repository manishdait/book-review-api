import router from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { deleteReview, updateReview } from '../service/reviewService';

const reviewRouter = router();

reviewRouter.use(authMiddleware);

reviewRouter.put('/:id', updateReview);
reviewRouter.delete('/:id', deleteReview);

export default reviewRouter;
