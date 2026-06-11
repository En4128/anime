export const mapDoc = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) {
    return doc.map(mapDoc);
  }
  if (typeof doc === 'object') {
    if (doc instanceof Date) return doc;
    const newDoc = {};
    for (const key in doc) {
      let newKey = key;
      
      // Convert snake_case keys to camelCase keys and relationship names
      if (key === 'id') {
        newKey = '_id';
        newDoc.id = doc.id; // Keep both for safety
      } else if (key === 'release_year') {
        newKey = 'releaseYear';
      } else if (key === 'poster_image') {
        newKey = 'posterImage';
      } else if (key === 'banner_image') {
        newKey = 'bannerImage';
      } else if (key === 'trending_score') {
        newKey = 'trendingScore';
      } else if (key === 'created_by') {
        newKey = 'createdBy';
      } else if (key === 'anime_id') {
        newKey = 'anime';
      } else if (key === 'user_id') {
        newKey = 'user';
      } else if (key === 'episode_id') {
        newKey = 'episode';
      } else if (key === 'video_url') {
        newKey = 'videoUrl';
      } else if (key === 'release_date') {
        newKey = 'releaseDate';
      } else if (key === 'last_watched_at') {
        newKey = 'lastWatchedAt';
      }
      
      newDoc[newKey] = mapDoc(doc[key]);
    }
    
    // Ensure both id and _id exist
    if (newDoc.id && !newDoc._id) {
      newDoc._id = newDoc.id;
    }
    if (newDoc._id && !newDoc.id) {
      newDoc.id = newDoc._id;
    }
    
    return newDoc;
  }
  return doc;
};
