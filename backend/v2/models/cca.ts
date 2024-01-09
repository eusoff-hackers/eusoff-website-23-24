import { Document, Schema, model } from 'mongoose';

interface iCca extends Document {
  name: string;
}

const rCca = {
  $id: `cca`,
  type: `object`,
  required: [`name`],
  properties: {
    name: { type: `string` },
  },
};

const ccaSchema = new Schema<iCca>({
  name: { type: String, required: true, index: 1 },
});

const Cca = model<iCca>(`Cca`, ccaSchema);

export { iCca, Cca, rCca };
