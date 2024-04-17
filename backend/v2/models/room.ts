import { Document, Schema, model } from 'mongoose';

import { iRoomBid } from './roomBid';

const BLOCKS_LIST = [`A`, `B`, `C`, `D`, `E`];
const GENDERS = ['Male', 'Female'];

interface iRoom extends Document {
  block: string;
  number: number;
  capacity: number;
  occupancy: number;
  allowedGenders: string[];
  bidders?: iRoomBid[];
}

const rRoom = {
  $id: `room`,
  type: `object`,
  required: [`_id`],
  properties: {
    _id: { type: `string` },
    block: { type: `string`, enum: BLOCKS_LIST },
    number: { type: `number` },
    capacity: { type: `number`, minimum: 1, maximum: 2 },
    occupancy: { type: `number`, minimum: 0, maximum: 2 },
    allowedGenders: { type: `array`, items: { type: `string`, enum: GENDERS } },
    bidders: { type: `array`, items: { $ref: `roomBid` } },
  },
};

const roomSchema = new Schema<iRoom>(
  {
    block: { type: String, required: true, index: 1, enum: BLOCKS_LIST },
    number: { type: Number, required: true },
    capacity: { type: Number, min: 1, max: 2, required: true },
    occupancy: { type: Number, min: 0, max: 2, required: true, default: 0 },
    allowedGenders: [{ type: String, enum: GENDERS }],
  },
  {
    toObject: { virtuals: true },
    virtuals: {
      bidders: {
        options: {
          ref: `RoomBid`,
          localField: `_id`,
          foreignField: `room`,
        },
      },
    },
  },
);

const Room = model<iRoom>(`Room`, roomSchema);

export { iRoom, Room, rRoom };
