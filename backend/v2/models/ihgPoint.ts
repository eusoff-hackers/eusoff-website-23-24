import { Document, Types, Schema, model } from 'mongoose';

interface iIhgPoint extends Document {
  hall: Types.ObjectId;
  gold: number;
  silver: number;
  bronze: number;
}

const rIhgPoint = {
  $id: `ihgPoint`,
  type: `object`,
  required: [`hall`, `gold`, `silver`, `bronze`],
  properties: {
    hall: { type: `string` },
    gold: { type: `number` },
    silver: { type: `number` },
    bronze: { type: `number` },
  },
  additionalProperties: false,
};

const ihgPointSchema = new Schema<iIhgPoint>({
  hall: {
    type: Schema.Types.ObjectId,
    ref: `Hall`,
    required: true,
    unique: true,
  },
  gold: { type: Number, required: true, default: 0 },
  silver: { type: Number, required: true, default: 0 },
  bronze: { type: Number, required: true, default: 0 },
});

const IhgPoint = model<iIhgPoint>(`IhgPoint`, ihgPointSchema);

export { iIhgPoint, IhgPoint, rIhgPoint };
