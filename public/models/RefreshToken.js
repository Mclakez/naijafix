import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
  // Link to user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Fast lookups by userId
  },
  
  // The actual token
  token: {
    type: String,
    required: true,
    unique: true // Each token must be unique
  },
  
  // Expiration
  expiresAt: {
    type: Date,
    required: true,
  },
  
  // Track usage
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now }
});

// Auto-delete expired tokens (MongoDB TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
