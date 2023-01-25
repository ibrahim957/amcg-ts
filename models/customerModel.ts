import mongoose,{ Schema,Document } from 'mongoose';

export interface IUser extends Document{
  name: string;
  email_address: string;
  password: string;
  otp?: string;
  photo?: string;
  status?: object;
}

const userSchema = new Schema<IUser>({
  email_address: { type: String, required: true },
  name: { type: String, required: true },
  password: {type: String, required: true},
  otp: {type: String},
  photo: {type: String},
  status:{
    policies_accepted:{type: Boolean, default:false},
    email_verified:{type:Boolean, default: false}
  }
});

export default mongoose.model<IUser>('User', userSchema);
