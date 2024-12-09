
import mongoose from "mongoose";


const appointmentSchema = new mongoose.Schema(
  {
    studentId: {
      type:String,
      required: true,
    },
    professorId: {
      type:String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "pending",
    },

  },
  { timestamps: true }
);

export const Appointments = mongoose.model("Appointments", appointmentSchema, "Appointments");

// module.exports = Appointments;