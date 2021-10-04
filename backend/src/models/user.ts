import { Schema } from 'mongoose';

// Document interface
interface User {
  username: string;
  email: string;
  password: string;
  balance: number;
  ID: string;
}

// Schema
const schema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: "number", required: true },
  ID: { type: String, required: true }
});