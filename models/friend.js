import mongoose from 'mongoose';
const {Schema}=mongoose;


const friendSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    tags: [{ type: String }],
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    neutral: [{ type: String }],
    lastContactDate: {
        type:Date
    },
    user:{type:Schema.Types.ObjectId,ref:"User"},
    timestamps: true
}, );

const friend = mongoose.model('Friend', friendSchema);

export default friend; 


