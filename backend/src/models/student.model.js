
import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const StudentSchema = new mongoose.Schema({
    student_name: {
      type: String,
      required: true,
      trim: true
    },
    enrollment_no: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    major: {
      type: String,
      required: true
    },
    graduation_year: {
      type: Number,
      required: true
    },
    birth_date: {
      type: Date,
      required: true
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
  

StudentSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password =await bcrypt.hash(this.password, 10);
    next();
})

StudentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

StudentSchema.methods.generateAccessToken = function(){
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

StudentSchema.methods.generateRefreshToken = async function(){
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
StudentSchema.plugin(mongooseAggregatePaginate)

export const Students = mongoose.model("Students", StudentSchema, "Students");

// module.exports = studentSchema;