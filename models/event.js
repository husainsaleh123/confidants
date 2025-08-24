import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['birthday', 'anniversary', 'goal'], required: true },
    friend: { type: Schema.Types.ObjectId, ref: 'Friend' }, 
    recurring: { type: String, default: 'never' },
    notified: { type: Boolean, default: false },
    description: { type: String },
}, {
    timestamps: true
});

export default mongoose.model('Event', eventSchema);