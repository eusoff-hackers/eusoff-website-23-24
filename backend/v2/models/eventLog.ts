import { Document, Schema, model, Types } from 'mongoose';

interface iEventLog extends Document {
  user?: Types.ObjectId;
  action: string;
  data?: string;
  timestamp: Date;
}

const eventLogSchema = new Schema<iEventLog>({
  user: { type: Schema.Types.ObjectId, ref: `User` },
  action: { type: `string`, required: true },
  data: { type: `string` },
  timestamp: { type: Date, default: Date.now, required: true },
});

const EventLog = model<iEventLog>(`EventLog`, eventLogSchema);

export { iEventLog, EventLog };
