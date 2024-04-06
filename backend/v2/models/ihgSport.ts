import { Document, Schema, model } from 'mongoose';

interface iIhgSport extends Document {
  name: string;
  isCarnival: boolean;
}

const rIhgSport = {
  $id: `ihgSport`,
  type: `object`,
  required: [`_id`],
  properties: {
    _id: { type: `string` },
    name: { type: `string` },
    isCarnival: { type: `boolean` },
  },
  additionalProperties: false,
};

const ihgSportSchema = new Schema<iIhgSport>({
  name: { type: String, required: true, index: 1 },
  isCarnival: { type: Boolean, required: true },
});

const IhgSport = model<iIhgSport>(`IhgSport`, ihgSportSchema);

export { iIhgSport, IhgSport, rIhgSport };
