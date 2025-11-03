import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await userModel.findOne({
            $or: [
                { googleId: profile.id },
                { email: profile.emails[0].value }
            ]
        });

        if (user) {
            // Update Google ID if user exists but doesn't have it
            if (!user.googleId) {
                user.googleId = profile.id;
                user.provider = 'google';
                await user.save();
            }
            return done(null, user);
        }

        // Create new user
        user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: 'google',
            password: 'oauth_user_' + Date.now() // Placeholder password for OAuth users
        });

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:4000/api/auth/github/callback",
    scope: ['user:email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // GitHub might not provide email directly
        const email = profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : `${profile.username}@github.user`;

        // Check if user already exists
        let user = await userModel.findOne({
            $or: [
                { githubId: profile.id },
                { email: email }
            ]
        });

        if (user) {
            // Update GitHub ID if user exists but doesn't have it
            if (!user.githubId) {
                user.githubId = profile.id;
                user.provider = 'github';
                await user.save();
            }
            return done(null, user);
        }

        // Create new user
        user = await userModel.create({
            name: profile.displayName || profile.username,
            email: email,
            githubId: profile.id,
            provider: 'github',
            password: 'oauth_user_' + Date.now() // Placeholder password for OAuth users
        });

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

export default passport;
