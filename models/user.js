import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const SALT_ROUNDS = 6;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    profilePic: { type: String }, // just save the path or URL
    friends:[{type: Schema.Types.ObjectId, ref:"Friend"}],
    interactions:[{type: Schema.Types.ObjectId, ref:"Interaction"}],
    stories:[{type: Schema.Types.ObjectId, ref:"Story"}],
    events:[{type: Schema.Types.ObjectId, ref:"Event"}],

}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

userSchema.pre('save', async function (next) {
    // 'this' is the use document
    if (!this.isModified('password')) return next();
    // update the password with the computed hash
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    return next();
});

export default mongoose.model('User', userSchema);