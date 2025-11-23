import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  _id: { type: String }, // if you want custom nanoid, else remove
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user","expert","admin"], default: "user" },

  // store refresh tokens hash or token IDs (for revoke/rotation)
  refreshTokens: [
    {
      token: String, // hashed refresh token or token id
      createdAt: Date,
      expiresAt: Date
    }
  ]
}, { timestamps: true });

// hash password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};


