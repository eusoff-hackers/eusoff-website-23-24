import { Document, Schema, model } from 'mongoose';

const BLOCKS_LIST = [`A`, `B`, `C`, `D`, `E`];

interface iRoomBlock extends Document {
  block: string;
  quota: number;
}

const rRoomBlock = {
  $id: `roomBlock`,
  type: `object`,
  properties: {
    block: { type: `string`, enum: BLOCKS_LIST },
    quota: { type: `number` },
    bidderCount: { type: `number` },
  },
};

const roomBlockSchema = new Schema<iRoomBlock>({
  block: {
    type: String,
    required: true,
    index: true,
    enum: BLOCKS_LIST,
    unique: true,
  },
  quota: { type: Number, required: true },
});

const RoomBlock = model<iRoomBlock>(`RoomBlock`, roomBlockSchema);

export { iRoomBlock, RoomBlock, rRoomBlock };
