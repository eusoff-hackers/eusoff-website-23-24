import { Document, Types, Schema, model } from 'mongoose';

require(`./user`);
require(`./team`);

interface iMember extends Document {
  user: Types.ObjectId;
  team: Types.ObjectId;
}

const memberSchema = new Schema<iMember>({
  user: { type: Schema.Types.ObjectId, required: true, ref: `User` },
  team: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: `Team`,
  },
});

const Member = model<iMember>(`Member`, memberSchema);

export { iMember, Member };
