import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    anime: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
    episode: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 500 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);

