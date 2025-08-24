import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const interactionSchema = new Schema({
    friendsInvolved:[{type:Schema.Types.ObjectId,ref:"Friend"}],
    author:{type:Schema.Types.ObjectId,ref:"User"},
    date:{type:Date},
    type:{type:String},
    notes:{type:String},
}, {
    timestamps: true,
});



export default mongoose.model('Interaction', interactionSchema);