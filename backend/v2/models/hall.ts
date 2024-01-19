import { Document, Types, Schema, model } from 'mongoose';

interface iHall extends Document {
  _id: Types.ObjectId;
  name: string;
}

const rHall = {
  $id: `hall`,
  type: `object`,
  required: [`_id`],
  properties: {
    _id: { type: `string` },
    name: { type: `string` },
  },
  additionalProperties: false,
};

const hallSchema = new Schema<iHall>({
  name: { type: String, required: true, index: 1 },
});

const Hall = model<iHall>(`Hall`, hallSchema);

export { iHall, Hall, rHall };
