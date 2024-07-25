import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'Friend'},
    friendName: { type: String, required: true },
    giftName: { type: String, required: true },
    reasons: { type: String, required: true },
    purchasePlace: { type: String, required: true },
    imageUrl: String,
});

const Gift = mongoose.model('Gift', giftSchema);

export { Gift };