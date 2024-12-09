Cypress.Commands.add('apiLogin', (user) => {
    return cy.request({
      method: 'POST',
      url: '/api/v1/auth/login',
      body: {
        email: user.email,
        password: user.password
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('accessToken')
      
      // Store the token for subsequent requests
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
        professorId: professorUser.id,
        date: new Date(),
        slotslots: timeSlots
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      return response.body
    })
  })
  
  Cypress.Commands.add('bookAppointment', (studentUser, appointmentDetails) => {
    return cy.request({
      method: 'POST', 
      url: '/api/v1/student/bookAppointments',
      headers: {
        'Authorization': `Bearer ${Cypress.env('authToken')}`
      },
      body: {
        studentId: studentUser.id,
        professorId: appointmentDetails.professorId,
        date: appointmentDetails.date,
        startTime: appointmentDetails.startTime,
        endTime: appointmentDetails.endTime
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
  
  Cypress.Commands.add('getStudentAppointments', (studentUser) => {
    return cy.request({
      method: 'GET',
      url: `/api/students/${studentUser.id}/appointments`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('authToken')}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      return response.body
    })
  })