import { Document, Types, Schema, model } from 'mongoose';

interface iCcaSignup extends Document {
  user: Types.ObjectId;
  cca: Types.ObjectId;
}

const rCcaSignup = {
  $id: `ccaSignup`,
  type: `object`,
  required: [`cca`],
  properties: {
    cca: { $ref: `cca` },
  },
  additionalProperties: false,
};

const ccaSignupSchema = new Schema<iCcaSignup>({
  user: { type: Schema.Types.ObjectId, required: true, ref: `User`, index: 1 },
  cca: { type: Schema.Types.ObjectId, required: true, ref: `Cca` },
});

const CcaSignup = model<iCcaSignup>(`CcaSignup`, ccaSignupSchema);

export { iCcaSignup, CcaSignup, rCcaSignup };
