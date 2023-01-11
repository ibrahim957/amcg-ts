import mongoose,{ Schema,Document } from 'mongoose';

export interface IUser extends Document{
  name: string;
  email_address: string;
  password?: string;
  photo?: string;
  status?: object;
}

const userSchema = new Schema<IUser>({
  email_address: { type: String, required: true, unique:true },
  name: { type: String },
  password: {type: String, required: true},
  photo: {type: String, unique: true},
  status:{
    policies_accepted:{type: Boolean, default:false},
    email_verified:{type:Boolean, default: false}
  }
});

export default mongoose.model<IUser>('User', userSchema);
