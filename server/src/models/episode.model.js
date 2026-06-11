import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema(
  {
    anime: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
    title: { type: String, required: true },
    number: { type: Number, required: true },
    synopsis: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    releaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

episodeSchema.index({ anime: 1, number: 1 }, { unique: true });

export const Episode = mongoose.model('Episode', episodeSchema);

