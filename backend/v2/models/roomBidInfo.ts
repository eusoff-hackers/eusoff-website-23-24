import { Types, Document, Schema, model } from 'mongoose';

interface iPointsDistribution extends Document {
  cca: string;
  points: number;
}

interface iRoomBidInfo extends Document {
  user?: Types.ObjectId;
  isEligible: boolean;
  points: number;
  canBid?: boolean;
  pointsDistribution: iPointsDistribution[];
}

const rRoomBidInfo = {
  $id: `roomBidInfo`,
  type: `object`,
  required: [`isEligible`, `points`],
  properties: {
    user: { $ref: `user` },
    isEligible: { type: `boolean` },
    points: { type: `number` },
    pointsDistribution: {
      type: `array`,
      items: {
        type: `object`,
        properties: {
          cca: { type: `string` },
          points: { type: `number` },
        },
        additionalProperties: false,
      },
    },
    canBid: { type: `boolean` },
  },
  additionalProperties: false,
};

const pointsDistributionSchema = new Schema<iPointsDistribution>({
  cca: { type: String, required: true },
  points: { type: Number, required: true },
});

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
  pointsDistribution: {
    type: [{ type: pointsDistributionSchema }],
    default: [],
  },
});

const RoomBidInfo = model<iRoomBidInfo>(`RoomBidInfo`, roomBidInfoSchema);

export { iRoomBidInfo, RoomBidInfo, rRoomBidInfo };
