import { Document, Types, Schema, model } from 'mongoose';

interface iIhgMatch extends Document {
  red: Types.ObjectId;
  blue: Types.ObjectId;
  timestamp: Date;
  pointsRed?: number;
  pointsBlue?: number;
}

const rIhgMatch = {
  $id: `ihgMatch`,
  type: `object`,
  required: [`red`, `blue`, `timestamp`],
  properties: {
    red: { $ref: `hall` },
    blue: { $ref: `hall` },
    timestamp: { type: `number` },
    pointsRed: { type: `number` },
    pointsBlue: { type: `number` },
  },
  additionalProperties: false,
};

const ihgMatchSchema = new Schema<iIhgMatch>({
  red: { type: Schema.Types.ObjectId, ref: `Hall`, required: true },
  blue: { type: Schema.Types.ObjectId, ref: `Hall`, required: true },
  timestamp: { type: Date, required: true },
  pointsRed: { type: Number },
  pointsBlue: { type: Number },
});

const IhgMatch = model<iIhgMatch>(`IhgMatch`, ihgMatchSchema);

export { iIhgMatch, IhgMatch, rIhgMatch };
