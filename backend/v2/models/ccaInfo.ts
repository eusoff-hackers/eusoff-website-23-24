import { Document, Types, Schema, model } from 'mongoose';

interface iCcaInfo extends Document {
  user?: Types.ObjectId;
  name: string;
  telegram: string;
  email: string;
}

const rCcaInfo = {
  $id: `ccaInfo`,
  type: `object`,
  required: [`name`, `telegram`, `email`],
  properties: {
    name: { type: `string` },
    telegram: { type: `string` },
    email: { type: `string` },
  },
  additionalProperties: false,
};

const ccaInfoSchema = new Schema<iCcaInfo>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: `User`,
    index: 1,
  },
  name: { type: String, required: true, index: 1 },
  telegram: { type: String, required: true },
  email: { type: String, required: true },
});

const CcaInfo = model<iCcaInfo>(`CcaInfo`, ccaInfoSchema);

export { iCcaInfo, CcaInfo, rCcaInfo };
