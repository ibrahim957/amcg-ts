import mongoose,{ Schema,Document,Types } from 'mongoose';

export interface IHistory extends Document{
  keywords: string;
  customer_id: string;
  memes: Types.Array<string>;
}

const historySchema = new Schema<IHistory>({
  keywords: { type: String, required: true },
  customer_id: { type: String, required: true },
  memes: [String],
});

export default mongoose.model<IHistory>('history', historySchema);
