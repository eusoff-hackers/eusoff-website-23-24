import { Types, Document, Schema, model } from 'mongoose';

interface iRoomBidInfo extends Document {
  user?: Types.ObjectId;
  isEligible: boolean;
  points: number;
  canBid?: boolean;
}

const rRoomBidInfo = {
  $id: `roomBidInfo`,
  type: `object`,
  required: [`isEligible`, `points`],
  properties: {
    user: { $ref: `user` },
    isEligible: { type: `boolean` },
    points: { type: `number` },
    canBid: { type: `boolean` },
  },
  additionalProperties: false,
};

const roomBidInfoSchema = new Schema<iRoomBidInfo>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: `User`,
    index: 1,
  },
  isEligible: { type: Boolean, required: true, default: false },
  points: { type: Number, required: true },
});

const RoomBidInfo = model<iRoomBidInfo>(`RoomBidInfo`, roomBidInfoSchema);

export { iRoomBidInfo, RoomBidInfo, rRoomBidInfo };
