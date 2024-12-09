// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('apiLogin', (user) => {
    return cy.request({
      method: 'POST',
      url: '/api/v1/auth/login',
      body: {
        email: user.email,
        password: user.password,
        role : user.role
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      console.log(response);
  
      Cypress.env('authToken', response.body.accessToken)
      return response.body
    })
  })
  
  Cypress.Commands.add('setAvailableTimeSlots', (professorUser, timeSlots) => {
    return cy.request({
      method: 'POST',
      url: '/api/v1/professor/createSlots',
      headers: {
        'Authorization': `Bearer ${Cypress.env('authToken')}`
      },
      body: {
        professorId: professorUser.professor_id,
        date: timeSlots.date,
        slots: timeSlots.slots
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      return response.body
    })
  })
  
  Cypress.Commands.add('bookAppointment', (studentUser,professorUser, slotsDetails, slotNo) => {
    return cy.request({
      method: 'POST', 
      url: '/api/v1/student/bookAppointments',
      headers: {
        'Authorization': `Bearer ${Cypress.env('authToken')}`
      },
      body: {
        studentId: studentUser.studentId,
        professorId: professorUser.professor_id,
        date: slotsDetails.date,
        start_time: slotsDetails.slots[slotNo].start_time,
        end_time: slotsDetails.slots[slotNo].end_time,
        status : slotsDetails.slots[slotNo].status
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      return response.body
    })
  })
  
  Cypress.Commands.add('cancelAppointment', (professorUser, appointmentId) => {
    return cy.request({
      method: 'PUT',
      url: `/api/appointments/${appointmentId}/cancel`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('authToken')}`
      },
      body: {
        professorId: professorUser.id
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      return response.body
    })
  })
  
  Cypress.Commands.add('getProfessorAppointments', (professorUser) => {
    return cy.request({
      method: 'POST',
      url:'/api/v1/professor/viewAppointments',
      headers: {
        'Authorization': `Bearer ${Cypress.env('authToken')}`
      },
      body:{
         professorId : professorUser.professor_id
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      return response.body
    })
  })