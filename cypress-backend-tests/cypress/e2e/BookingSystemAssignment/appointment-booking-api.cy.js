import users from '../../fixtures/users.json'
import appointments from '../../fixtures/appointments.json'
import slots from "../../fixtures/slots.json"

describe('Appointment Booking API End-to-End Scenario', () => {
  let bookingId; 

  it('Student A1 Authenticates', () => {
    

    cy.apiLogin(users.studentA1)

  })

  

  it('Professor P1 Authenticates', () => {

    cy.apiLogin(users.professorP1)



 
  })




  it('Professor P1 Creates Availability slots', () => {

    cy.setAvailableTimeSlots(users.professorP1, slots) 
  })



  
  it('Student A1 Views Availability slots', () => {

    
  })




  it('Student A1  books an appointment with Professor P1 for time T1.', () => {

    let slotNo = 1
    cy.bookAppointment(users.studentA1, users.professorP1, slots, slotNo).then((booking) => {
        bookingId = booking.id
      })
  })


  it('Student A2 Authenticates', () => {

    cy.apiLogin(users.studentA2)
  })

  it('Student A2  books an appointment with Professor P1 for time T2.', () => {

    let slotNo = 2
    cy.bookAppointment(users.studentA2, users.professorP1, slots, slotNo).then((booking) => {
        bookingId = booking.id
      })
  })

  it('Professor P1 Sees all the Appointments and Cancels the Appointment he wants', () => {

    let storedAppointments = []; 
    let appointmentToCancel;


      cy.getProfessorAppointments(users.professorP1).then((appointments) => {
    
        storedAppointments = appointments;
  
        
        cy.log('Stored Appointments:', JSON.stringify(appointments))
  
      })

      

      
  })





  
})