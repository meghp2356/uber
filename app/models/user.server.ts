import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the user interface for type safety
interface IUser extends Document {
  fullName: {
    firstName: string;
    lastName?: string; // Optional
  };
  email: string;
  password: string;
  socketId: string | null;
  accessToken : string;
  refreshToken : string

  // Instance methods
  genAuthToken: () => { accessToken :string , refreshToken : string} ;
  comparePassword: (pass: string) => Promise<boolean>;
}

// Static methods for the model
interface IUserModel extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      default : null
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  password: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    default: null,
  },
  accessToken : {
    type : String,
    default : null
  },
  refreshToken : {
    type : String,
    default : null
  }
});

// **Instance Methods**

// Generate JWT token
userSchema.methods.genAuthToken = async function (){

  const accessToken : string = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "2h", // Optional expiration time
  });

  const refreshToken : string = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "7d", // Optional expiration time
  });

  this.accessToken = accessToken;
  this.refreshToken = refreshToken;
  await this.save();

  return { accessToken , refreshToken};
};

// Compare passwords
userSchema.methods.comparePassword = async function (pass: string): Promise<boolean> {
  return await bcrypt.compare(pass, this.password);
};

// **Static Methods**

// Hash password
userSchema.statics.hashPassword = async function (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Create the User model
const User: IUserModel = mongoose.models.User || mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
