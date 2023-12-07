import { Document, Schema, model } from 'mongoose';

interface iJersey extends Document {
  number: number;
  quota: {
    Male: number;
    Female: number;
  };
}

const rJersey = {
  $id: `jersey`,
  type: `object`,
  required: [`number`],
  properties: {
    number: { type: `number` },
    quota: {
      type: `object`,
      required: [`Male`, `Female`],
      properties: {
        Male: { type: `number` },
        Female: { type: `number` },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

const jerseySchema = new Schema<iJersey>({
  number: { type: Number, required: true, unique: true, index: 1 },
  quota: {
    Male: { type: Number, required: true, default: 3 },
    Female: { type: Number, required: false, default: 3 },
  },
});

const Jersey = model<iJersey>(`Jersey`, jerseySchema);

export { iJersey, Jersey, rJersey };
