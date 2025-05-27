import { Request, Response } from 'express';
import bcryt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import { User } from '../model/user';
import { Config } from '../config/config';
import { ObjectId } from 'mongodb';

const secretKey = Config.ACCESS_TOKEN_KEY;

export async function registerUser(req: Request, res: Response) {
  try {
    const {username, email, password} = req.body;
    const hashedPassword = await bcryt.hash(password, 10);
  
    const user = new User({username: username, email: email, password: hashedPassword});
    await user.save();

    const accessToken = generateAccessToken(user._id);

    const response = {
      username: username,
      accessToken: accessToken
    }

    res.status(201).json(response);
  } catch(error) {
    console.log(error);
    
    res.status(500).json({error: 'Fail to register user'});
  }
}

export async function authenticateUser(req: Request, res: Response) {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username: username});

    if (!user) {
      res.status(403).json({error: `Can't find user`});
      return;
    }

    if (!await bcryt.compare(password, user.password!)) {
      res.status(403).json({error: `Invalid password`});
      return;
    }

    const accessToken = generateAccessToken(user._id);

    const response = {
      username: username,
      accessToken: accessToken
    }

    res.status(200).json(response);
  } catch(error) {
    console.log(error);
    
    res.status(500).json({error: 'Fail to authenticate user'});
  }
}

function generateAccessToken(userId: ObjectId) {
  const payload = {userId: userId}
  return jsonwebtoken.sign(payload, secretKey!, {expiresIn: '1h'});
}
