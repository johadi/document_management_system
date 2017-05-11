import dotenv from 'dotenv';
import Sendgrid from 'sendgrid';
import jsLogger from 'js-logger';
import * as helper from 'sendgrid/lib/helpers/mail/mail';

// Create a mailer
const sg = Sendgrid(process.env.SENDGRID_KEY);
dotenv.load();

const mailer = (password, email) => {
  if (process.env.NODE_ENV !== 'test') {
    const message = `Hi, an account have been created for you by the admin
    <p>Your password is <b>${password}</b></p>
    </p>Kindly login using e-docman.herokuapp.com with you email and password sent</p>`;
    const fromEmail = new helper.Email('info@e-docman.herokuapp.com');
    const toEmail = new helper.Email(email);
    const subject = 'E-DOCMAN: An account created for you';
    const content = new helper.Content('text/html', message);
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);

    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, (error, response) => {
      jsLogger.debug(`Status ${response.statusCode}`);
    });
  }
};

export default mailer;
