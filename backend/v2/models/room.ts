import { Document, Schema, model } from 'mongoose';

const BLOCKS_LIST = [`A`, `B`, `C`, `D`, `E`];

interface iRoom extends Document {
  block: string;
  number: number;
  capacity: number;
  occupancy: number;
}

const rRoom = {
  $id: `room`,
  type: `object`,
  required: [`block`, `number`],
  properties: {
    block: { type: `string`, enum: BLOCKS_LIST },
    number: { type: `number` },
    capacity: { type: `number`, mimimum: 1, maximum: 2 },
    occupancy: { type: `number`, minimum: 0, maximum: 2 },
  },
};

const roomSchema = new Schema<iRoom>({
  block: { type: String, required: true, index: 1, enum: BLOCKS_LIST },
  number: { type: Number, required: true },
  capacity: { type: Number, min: 1, max: 2 },
  occupancy: { type: Number, min: 0, max: 2 },
});

const Room = model<iRoom>(`Room`, roomSchema);

export { iRoom, Room, rRoom };
