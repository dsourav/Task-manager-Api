const sgMail = require('@sendgrid/mail');

const sendGridApiKey = process.env.SEND_GRID_API_KEY;

sgMail.setApiKey(sendGridApiKey)

const sendWelcomEmail = (email,name)=>{
    const msg = {
      to: email,
      from: 'das264275@gmail.com',
      subject: 'Thanks for joining in!',
      text: `Welcome to the app, ${name}, Let me know how you get along with the app.`,
    };
  
    sgMail
    .send(msg)
    .then(() => {}, error => {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    });
  }

  const sendCancelationWEmail= (email,name)=>{
    const msg = {
      to: email,
      from: 'das264275@gmail.com',
      subject: 'Your are leaving our app!',
      text: `Hi, ${name}, Let me know why are you leaving our app.`,
    };
  
    sgMail
    .send(msg)
    .then(() => {}, error => {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    });
  }

  module.exports = {
    sendWelcomEmail,
    sendCancelationWEmail
  }