import { Schema, model, Document } from 'mongoose';

interface ResetCodeInterface extends Document {
    user: Schema.Types.ObjectId,
    code: string
};

const ResetCodeSchema = new Schema<ResetCodeInterface>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
        unique: true,
    },
    code: {
        type: String,
        required: true,
    }
}, { timestamps: true });

ResetCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default model<ResetCodeInterface>('resetCode', ResetCodeSchema);