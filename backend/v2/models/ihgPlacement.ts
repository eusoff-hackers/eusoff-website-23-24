import { Document, Types, Schema, model, PopulatedDoc } from 'mongoose';
import './hall';
import { iIhgSport } from './ihgSport';

interface iIhgPlacement extends Document {
  hall: Types.ObjectId;
  sport: PopulatedDoc<iIhgSport>;
  place: number;
}

const ihgPlacementSchema = new Schema<iIhgPlacement>({
  hall: { type: Schema.Types.ObjectId, required: true, ref: `Hall`, index: 1 },
  sport: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `IhgSport`,
  },
  place: { type: Number, min: 1, max: 6 },
});

const IhgPlacement = model<iIhgPlacement>(`IhgPlacement`, ihgPlacementSchema);

export { iIhgPlacement, IhgPlacement };
