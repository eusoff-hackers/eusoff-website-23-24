import { Document, Types, Schema, model } from 'mongoose';

interface iIhgMatch extends Document {
  red: Types.ObjectId;
  blue: Types.ObjectId;
  sport: Types.ObjectId;
  timestamp: Date;
  pointsRed?: number;
  pointsBlue?: number;
  venue: string;
  stage?: string;
}

const rIhgMatch = {
  $id: `ihgMatch`,
  type: `object`,
  required: [`red`, `blue`, `timestamp`, `venue`],
  properties: {
    red: { $ref: `hall` },
    blue: { $ref: `hall` },
    sport: { $ref: `ihgSport` },
    timestamp: { type: `number` },
    pointsRed: { type: `number` },
    pointsBlue: { type: `number` },
    venue: { type: `string` },
    stage: { type: `string` },
  },
  additionalProperties: false,
};

const ihgMatchSchema = new Schema<iIhgMatch>({
  red: { type: Schema.Types.ObjectId, ref: `Hall`, required: true },
  blue: { type: Schema.Types.ObjectId, ref: `Hall`, required: true },
  sport: { type: Schema.Types.ObjectId, ref: `IhgSport`, required: true },
  timestamp: { type: Date, required: true },
  pointsRed: { type: Number },
  pointsBlue: { type: Number },
  venue: { type: String, required: true },
  stage: { type: String },
});

const IhgMatch = model<iIhgMatch>(`IhgMatch`, ihgMatchSchema);

export { iIhgMatch, IhgMatch, rIhgMatch };
