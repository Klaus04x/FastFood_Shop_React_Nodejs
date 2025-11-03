import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

// Google OAuth routes
authRouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
        session: false
    }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/auth/callback?token=${token}&provider=google`);
    }
);

// GitHub OAuth routes
authRouter.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

authRouter.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: 'http://localhost:5173/login?error=github_auth_failed',
        session: false
    }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/auth/callback?token=${token}&provider=github`);
    }
);

export default authRouter;
