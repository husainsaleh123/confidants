import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const storySchema = new Schema({
    title:{type:String},
    content:{type:String},
    date:{type:Date},
    author:{type:Schema.Types.ObjectId,ref:"User"},
    friendsInvolved:[{type:Schema.Types.ObjectId,ref:"Friend"}],
    photos:[{type:String}],
    mood:{type:String},
    visibility:{type:String},
}, {
    timestamps: true,
});



export default mongoose.model('Story', storySchema);