import { Document, Schema, model } from 'mongoose';

interface iTeam extends Document {
  name: string;
  shareable: boolean;
}

const rTeam = {
  $id: `team`,
  type: `object`,
  required: [`name`, `shareable`],
  properties: {
    name: { type: `string` },
    shareable: { type: `boolean` },
  },
  additionalProperties: false,
};

const teamSchema = new Schema<iTeam>({
  name: { type: String, required: true, unique: true, index: 1 },
  shareable: { type: Boolean, required: true },
});

const Team = model<iTeam>(`Team`, teamSchema);

export { iTeam, Team, rTeam };
