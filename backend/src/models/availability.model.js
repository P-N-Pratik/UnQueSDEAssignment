import mongoose from "mongoose";



const DailyAvailabilitySchema = new mongoose.Schema({
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    slots: [
      {
      start_time: {
        type: Date,
        required: true
      },
      end_time: {
        type: Date,
        required: true
      },
      status: {
        type: String,
        enum: ['available', 'booked', 'blocked', 'completed'],
        default: 'available'
      },
      booked_by: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    }
  ],
  }, 
  { 
    timestamps: true,
  });


export const Availability = mongoose.model("Availability", DailyAvailabilitySchema, "Availability");

// module.exports = Availability;