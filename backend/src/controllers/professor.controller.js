
import {asyncHandler} from "../utils/asyncHandler.js";
// import userSchema import {User} from "../models/user.model.js"
// import studentSchema import {Student} from "../models.student.model.js";
// import professorSchema import {Professor} from "../models/professor.model.js"
import {Availability} from "../models/availability.model.js";
import {Appointments} from "../models/appointment.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"



const createSlots = asyncHandler(async(req, res) => {
  console.log(req.body);

    const { professorId, date, slots } = req.body;

 
  if (!professorId || !date || !slots || slots.length === 0) {
    throw new ApiError(400, "Invalid slot creation parameters");
  }

  
  const existingAvailability = await Availability.findOne({ 
    professorId, 
    date: new Date(date) 
  });

  let availability;

  if (existingAvailability) {
    existingAvailability.slots.push(...slots);
    availability = await existingAvailability.save();
  } else {
    availability = await Availability.create({
      professorId,
      date,
      slots
    });
  }

  return res.status(201).json(
    new ApiResponse(201, availability, "Slots created successfully")
  );


})

// ==================================================================================================================================




const viewAppointments = asyncHandler(async(req, res) => {
  
  const { professorId } = req.body;


  if (!professorId) {
    return res.status(400).json(
      new ApiResponse(400, null, "Professor ID is required")
    );
  }

  try {
    
    const appointments = await Appointments.find({ professorId })
      .sort({ date: 1, start_time: 1 }) 
      .lean(); 

 
    if (appointments.length === 0) {
        throw new ApiError(404, "No appointments found for this professor")
    
    }

    
    const groupedAppointments = appointments.reduce((acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    }, {});

    
    return res.status(200).json(
      new ApiResponse(200, {
        total: appointments.length,
        groupedByDate: groupedAppointments,
        allAppointments: appointments
      }, "Appointments retrieved successfully")
    );
  } catch (error) {

    throw new ApiError(500, "Error retrieving appointments", )
    
  }
});
  

// ==================================================================================================================================



const deleteAppointments = asyncHandler(async(req, res) => {


   const { appointmentId } = req.body;
  

   if (!appointmentId) {
     throw new ApiError(400, "Appointment ID is required");
   }
 
   try {

     const appointment = await Appointments.findById(appointmentId);
 
     if (!appointment) {
       throw new ApiError(404, "Appointment not found");
     }
 
     if (appointment.status === 'completed') {
       throw new ApiError(400, "Completed appointments cannot be deleted");
     }
 
     const appointmentDate = new Date(`${appointment.date}T${appointment.start_time}`);
     const now = new Date();
     const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
 
     if (hoursDifference < 24) {
       throw new ApiError(400, "Appointments cannot be deleted within 24 hours of the scheduled time");
     }
 
    
     await Appointments.findByIdAndDelete(appointmentId);
 
    
     return res.status(200).json(
       new ApiResponse(200, null, "Appointment deleted successfully")
     );
 
   } catch (error) {
     
      throw new ApiResponse(500, null, "Error deleting appointment");
 
   }

  
})



export {createSlots, viewAppointments, deleteAppointments}