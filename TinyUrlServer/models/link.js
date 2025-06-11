// Proposed content for d:\nodeJs\TinyUrlServer\models\link.js
import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
    insertedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: [true, 'IP address is required']
    },
    targetParamValue: String
});

const targetValueSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Target name is required']
    },
    value: {
      type: String,
      required: [true, 'Target value is required']
    }
  });

const linkSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: [true, 'Original URL is required.'],
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This creates the relationship to your User model
        required: [true, 'A link must belong to a user.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    clicks: [clickSchema],
    targetParamName: {
      type: String,
      default: 't'  // Default parameter name is 't' for shorter URLs
    },
    targetValues: [targetValueSchema],  // Array of possible target values
    createdAt: {
      type: Date,
      default: Date.now
    }
    
});

// Optional: Add an index for faster queries if users will have many links
// linkSchema.index({ user: 1 });

const Link = mongoose.model('Link', linkSchema);

export default Link;