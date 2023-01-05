import mongoose,{ Schema,Document } from 'mongoose';

export interface IUser extends Document{
  name: string;
  email: string;
  password?: string;
  photo?: string;
  status?: object;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique:true },
  name: { type: String, required: true },
  password: {type: String, required: true},
  photo: {type: String, required: true, unique: true},
  status:{
    policies_accepted:{type: Boolean, default:false},
    email_verified:{type:Boolean, default: false}
  }
});

export default mongoose.model<IUser>('User', userSchema);
