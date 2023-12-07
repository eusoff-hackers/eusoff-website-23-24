import { Document, Types, Schema, model } from 'mongoose';
import './jersey';
import './team';

interface iJerseyBan extends Document {
  jersey: Types.ObjectId;
  team: Types.ObjectId;
}

const jerseyBanSchema = new Schema<iJerseyBan>({
  jersey: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `Jersey`,
    index: 1,
  },
  team: { type: Schema.Types.ObjectId, required: true, ref: `Team`, index: 1 },
});

const JerseyBan = model<iJerseyBan>(`JerseyBan`, jerseyBanSchema);

export { iJerseyBan, JerseyBan };
