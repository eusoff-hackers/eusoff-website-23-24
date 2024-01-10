import { Document, Types, Schema, model } from 'mongoose';

interface iCca extends Document {
  _id: Types.ObjectId;
  name: string;
}

const rCca = {
  $id: `cca`,
  type: `object`,
  required: [`_id`],
  properties: {
    _id: { type: `string` },
    name: { type: `string` },
  },
  additionalProperties: false,
};

const ccaSchema = new Schema<iCca>({
  name: { type: String, required: true, index: 1 },
});

const Cca = model<iCca>(`Cca`, ccaSchema);

export { iCca, Cca, rCca };
