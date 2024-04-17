import { Document, Types, Schema, model } from 'mongoose';
import './user';
import './room';

interface iRoomBid extends Document {
  user: Types.ObjectId;
  room: Types.ObjectId;
  priority: number;
}

const rRoomBid = {
  $id: `roomBid`,
  type: `object`,
  required: [`room`],
  properties: {
    room: { $ref: `room` },
    priority: { type: `number` },
  },
  additionalProperties: false,
};

const roomBidSchema = new Schema<iRoomBid>({
  user: { type: Schema.Types.ObjectId, required: true, ref: `User`, index: 1 },
  room: { type: Schema.Types.ObjectId, required: true, ref: `Room` },
  priority: { type: Number, required: true },
});

const RoomBid = model<iRoomBid>(`RoomBid`, roomBidSchema);

export { iRoomBid, RoomBid, rRoomBid };
