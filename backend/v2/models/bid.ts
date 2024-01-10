import { Document, Types, Schema, model } from 'mongoose';
import './user';
import './jersey';

interface iBid extends Document {
  user: Types.ObjectId;
  jersey: Types.ObjectId;
  priority: number;
}

const rBid = {
  $id: `bid`,
  type: `object`,
  required: [`jersey`],
  properties: {
    jersey: { $ref: `jersey` },
    priority: { type: `number` },
  },
  additionalProperties: false,
};

const bidSchema = new Schema<iBid>({
  user: { type: Schema.Types.ObjectId, required: true, ref: `User`, index: 1 },
  jersey: { type: Schema.Types.ObjectId, required: true, ref: `Jersey` },
  priority: { type: Number, required: true },
});

const Bid = model<iBid>(`Bid`, bidSchema);

export { iBid, Bid, rBid };
