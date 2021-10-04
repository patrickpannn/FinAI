import { Schema } from 'mongoose';

// Document interface
interface User {
  name: string;
  email: string;
  ID: string;
}

// Schema
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  ID: { type: String, required: true }
});