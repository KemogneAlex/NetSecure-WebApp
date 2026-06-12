/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 31/05/2024 - 01:04:35
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 31/05/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY, // Votre clé publique Mailjet
    process.env.MAILJET_API_SECRET // Votre clé secrète Mailjet
  );
// Fonction pour envoyer un email
exports.sendEmail = (toEmail, subject, textContent, htmlContent) => {
    const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages":[{
          "From": {
            "Email": "kemognemalone@gmail.com", 
            "Name": "KemogneMalone"
          },
          "To": [{
            "Email": toEmail,
          }],
          "Subject": subject,
          "TextPart": textContent,
          "HTMLPart": htmlContent
        }]
      });
  
    return request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  };  