import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friend' }],
    recurring: { type: String, required: true },
    notified: { type: Boolean, default: false },
    description: { type: String },
    author: { type:Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

export default mongoose.model('Event', eventSchema);