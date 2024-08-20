import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
const userSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    email:{
      type:String,
      required: true,
      unique: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ['superAdmin','admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

userSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

userSchema.static('isUserExist', async function (id) {
  return await User.findOne({ id }).select('+password');
});

userSchema.static(
  'isPasswordMatched',
  async function (newPassword, hashedPassword) {
    return await bcrypt.compare(newPassword, hashedPassword);
  },
);
userSchema.static(
  'isJWTIssuedBeforePasswordChange',
  async function (passwordChangedTime: Date, jwtIssuedTime: number) {
    const passwordChangedAt = new Date(passwordChangedTime).getTime() / 1000;

    return passwordChangedAt > jwtIssuedTime;
  },
);

export const User = model<IUser, UserModel>('User', userSchema);
