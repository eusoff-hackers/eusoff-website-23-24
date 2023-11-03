import { Document, Types, Schema, model } from 'mongoose';
import './user';
import './jersey';

interface iBid extends Document {
  user: Types.ObjectId;
  jersey: Types.ObjectId;
}

const rBid = {
  $id: `bid`,
  type: `object`,
  required: [`jersey`],
  properties: {
    jersey: { type: `number` },
  },
  additionalProperties: false,
};

const bidSchema = new Schema<iBid>({
  user: { type: Schema.Types.ObjectId, required: true, ref: `User`, index: 1 },
  jersey: { type: Schema.Types.ObjectId, required: true, ref: `Jersey` },
});

const Bid = model<iBid>(`Bid`, bidSchema);

export { iBid, Bid, rBid };
