import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        // Minimum password length can be added if using birth_date as password
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['student', 'professor', 'admin'],
        required: true,
        default: 'student'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students', // Reference to the Students model
        required: function() { return this.role === 'student'; }
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professors', // Reference to the Professors model
        required: function() { return this.role === 'professor'; }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true 
});

// Pre-save middleware for password hashing
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
UserSchema.methods.isPasswordCorrect = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

// Static method to find user by email
UserSchema.statics.findByEmail = async function(email) {
    return await this.findOne({ email });
};

// Compound index for performance
UserSchema.index({ email: 1, role: 1 });

// Add mongoose aggregate pagination
UserSchema.plugin(mongooseAggregatePaginate);

// Create the model
export const User = mongoose.model('User', UserSchema, 'Users');