import mongoose from 'mongoose';
import slugify from 'slugify';
import { ANIME_STATUS } from '../constants/anime.js';

const animeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    synopsis: { type: String, default: '' },
    genres: [{ type: String }],
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    releaseYear: { type: Number, default: new Date().getFullYear() },
    status: { type: String, enum: Object.values(ANIME_STATUS), default: ANIME_STATUS.ONGOING },
    posterImage: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

animeSchema.virtual('episodes', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'anime',
  justOne: false,
});

animeSchema.pre('save', function setSlug(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Anime = mongoose.model('Anime', animeSchema);

