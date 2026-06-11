import mongoose from 'mongoose';
import { USER_ROLES, DEFAULT_ROLE } from '../constants/roles.js';

const continueWatchingSchema = new mongoose.Schema(
  {
    anime: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
    episode: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode', required: true },
    progress: { type: Number, default: 0 }, // seconds
    duration: { type: Number, default: 0 },
    lastWatchedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 32 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(USER_ROLES), default: DEFAULT_ROLE },
    avatar: { type: String, default: '' },
    banner: { type: String, default: '' },
    bio: { type: String, default: '' },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    likedAnime: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    continueWatching: [continueWatchingSchema],
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function toPublic() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model('User', userSchema);

