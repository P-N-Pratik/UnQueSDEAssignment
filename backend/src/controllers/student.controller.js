

import {asyncHandler} from "../utils/asyncHandler.js";
import {Availability} from "../models/availability.model.js";
import {Appointments} from "../models/appointment.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";



const viewSlots = asyncHandler(async(req, res) => {

    const { professorId, date } = req.body;

    if (!professorId || !date) {
      throw new ApiError(400, "Professor ID and Date are required");
    }
  
    const availability = await Availability.findOne({
      professorId,
      date: new Date(date)
    });
  
    if (!availability) {
      return res.status(200).json(
        new ApiResponse(200, [], "No slots found")
      );
    }
  
    const availableSlots = availability.slots.filter(
      slot => slot.status === 'available'
    );
  
    return res.status(200).json(
      new ApiResponse(200, availableSlots, "Available slots retrieved")
    );


})


const bookAppointments = asyncHandler(async(req, res) => {

    const { 
        studentId, 
        professorId, 
        date, 
        start_time, 
        end_time 
      } = req.body;
    
      // Validate input
      if (!studentId || !professorId || !date || !start_time || !end_time) {
        throw new ApiError(400, "All appointment details required");
      }
    
      const existingAppointment = await Appointments.findOne({
        professorId,
        date,
        $or: [
          { 
            start_time: { $lt: end_time },
            end_time: { $gt: start_time }
          }
        ]
      });
    
      if (existingAppointment) {
        throw new ApiError(409, "Slot already booked  Or are Conflicting the Appointments");
      }
    
      // Create appointment
      const appointment = await Appointments.create({
        studentId,
        professorId,
        date,
        start_time,
        end_time,
        status: "pending"
      });
    
      return res.status(201).json(
        new ApiResponse(201, appointment, "Appointment booked successfully")
      );
})



export {viewSlots, bookAppointments}

