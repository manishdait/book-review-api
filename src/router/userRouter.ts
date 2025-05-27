import router from 'express';
import { authenticateUser, registerUser } from '../service/userService';

const userRouter = router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', authenticateUser);

export default userRouter;
