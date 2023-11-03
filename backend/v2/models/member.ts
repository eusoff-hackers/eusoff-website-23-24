import { Document, Types, Schema, model } from 'mongoose';
import './user';
import './team';

interface iMember extends Document {
  user: Types.ObjectId;
  team: Types.ObjectId;
}

const memberSchema = new Schema<iMember>({
  user: { type: Schema.Types.ObjectId, required: true, ref: `User`, index: 1 },
  team: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `Team`,
  },
});

const Member = model<iMember>(`Member`, memberSchema);

export { iMember, Member };
