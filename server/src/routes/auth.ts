import express, { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const authRouter = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Both GET and POST handlers should use the same v3 endpoint
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

// authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// authRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect('/reservations');
// });
// authRouter.get('/auth/logout', (req, res, done) => {
//   req.logout((err) => {
//     if (err) return done(err);
//     res.redirect('/');
//   });
// });

authRouter.get('/auth/google-callback', async (req: Request, res: Response) => {
  try {
    const token = req.query.access_token;
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const userData = await response.json();
    
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({
        email: userData.email,
        name: userData.name,
        googleId: userData.sub
      });
    }
    
    const jwtToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.redirect('/');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect('/login?error=auth_failed');
  }
});

authRouter.get('/auth/status', (req: Request, res: Response) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.json({ isLoggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    res.json({ isLoggedIn: true, email: decoded.email });
  } catch (error) {
    res.json({ isLoggedIn: false });
  }
});

authRouter.post('/auth/google-callback', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const userData = await response.json();
    
    let user = await User.findOne({ email: userData.email }).exec();
    if (!user) {
      user = await User.create({
        email: userData.email,
        name: userData.name,
        googleId: userData.sub
      });
    }
    
    const jwtToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

authRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

export default authRouter; 