import { Document, Schema, model } from 'mongoose';

interface iServer extends Document {
  key: string;
  value: string | number | boolean;
}

const serverSchema = new Schema<iServer>({
  key: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
});

const Server = model<iServer>(`Server`, serverSchema);

export { iServer, Server };
