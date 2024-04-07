import { Document, Schema, model } from 'mongoose';

import './member';

interface iUser extends Document {
  username: string;
  password: string;
  role: `USER` | `ADMIN`;
  year: number;
  gender: `Male` | `Female`;
  email: string;
  room: string;
}

const rUser = {
  $id: `user`,
  type: `object`,
  required: [`username`],
  properties: {
    username: { type: `string` },
    role: { type: `string`, enum: [`USER`, `ADMIN`] },
    year: { type: `number`, minimum: 0, maximum: 5 },
    gender: { type: `string`, enum: [`Male`, `Female`] },
    room: { type: `string` },
  },
  additionalProperties: false,
};

const userSchema = new Schema<iUser>(
  {
    username: { type: String, required: true, unique: true, index: 1 },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [`USER`, `ADMIN`],
      default: `USER`,
      required: true,
    },
    year: { type: Number, min: 0, max: 5, required: true },
    gender: { type: String, enum: [`Male`, `Female`], required: true },
    email: { type: String },
    room: { type: String, required: true },
  },
  { toObject: { virtuals: true } },
);

userSchema.virtual(`teams`, {
  ref: `Member`,
  localField: `_id`,
  foreignField: `user`,
});

const User = model<iUser>(`User`, userSchema);

export { iUser, User, rUser };
