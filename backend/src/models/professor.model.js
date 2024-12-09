

import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const professorSchema = new mongoose.Schema({
  professor_name: {
    type: String,
    required: [true, 'Professor name is required'],
    trim: true,
    maxlength: [100, 'Professor name cannot exceed 100 characters']
  },
  contact_no: {
    type: String,
    required: true,
    unique: true,
    match: [/^[+]?[\d\s()-]{10,15}$/, 'Please enter a valid contact number']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  department: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Department name cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false 
  },
  refreshToken :{
    type: String
}
}, {
  timestamps: true 
});

professorSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();

  try {
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


professorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

professorSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
              
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn : process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}

professorSchema.methods.generateRefreshToken = async function(){
  return jwt.sign(
      {
          _id: this._id,
              
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn : process.env.REFRESH_TOKEN_EXPIRY
      }
  )

}
professorSchema.plugin(mongooseAggregatePaginate)

export const Professor = mongoose.model('Professors', professorSchema, 'Professors');