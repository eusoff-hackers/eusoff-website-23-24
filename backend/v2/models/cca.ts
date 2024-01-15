import { Document, Types, Schema, model } from 'mongoose';

interface iCca extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  heads: string[];
  contacts: string[];
  description: string;
  committees: string[];
}

const rCca = {
  $id: `cca`,
  type: `object`,
  required: [`_id`],
  properties: {
    _id: { type: `string` },
    name: { type: `string` },
    category: { type: `string` },
    heads: {
      type: `array`,
      items: { type: `string` },
    },
    contacts: {
      type: `array`,
      items: { type: `string` },
    },
    description: { type: `string` },
    committees: {
      type: `array`,
      items: { type: `string` },
    },
  },
  additionalProperties: false,
};

const ccaSchema = new Schema<iCca>({
  name: { type: String, required: true, index: 1 },
  category: { type: String },
  heads: {
    type: [String],
  },
  contacts: {
    type: [String],
  },
  description: { type: String },
  committees: {
    type: [String],
  },
});

const Cca = model<iCca>(`Cca`, ccaSchema);

export { iCca, Cca, rCca };
