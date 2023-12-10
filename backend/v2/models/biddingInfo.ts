import { Types, Document, Schema, model } from 'mongoose';
import './jersey';

interface iBiddingInfo extends Document {
  user?: Types.ObjectId;
  round: number;
  points: number;
  allocated: boolean;
  jersey?: Types.ObjectId;
}

const rBiddingInfo = {
  $id: `biddingInfo`,
  type: `object`,
  required: [`round`, `points`],
  properties: {
    round: { type: `number` },
    points: { type: `number` },
    allocated: { type: `boolean` },
    jersey: { $ref: `jersey` },
    user: { $ref: `user` },
  },
  additionalProperties: false,
};

const biddingInfoSchema = new Schema<iBiddingInfo>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: `User`,
    index: 1,
  },
  round: { type: Number, required: true },
  points: { type: Number, required: true },
  allocated: { type: Boolean, required: true, default: false },
  jersey: { type: Schema.Types.ObjectId, ref: `Jersey` },
});

const BiddingInfo = model<iBiddingInfo>(`BiddingInfo`, biddingInfoSchema);

export { iBiddingInfo, BiddingInfo, rBiddingInfo };
