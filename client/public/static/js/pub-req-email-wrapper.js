// Emailjs Credentials
const SERVICE_ID = "service_38la09d";
const PUBLIC_KEY = "ywVrx362IPt0-qvnx";

// Template / Template ID
const APPROVE = "pubApproved"
const PUB_APPROVE_TEMPLATE_ID = "template_nzetfa7";
const DENY = "pubDenied";
const PUB_DENIED_TEMPLATE_ID = "template_pjxabm3";

// Message
const SENDING_APPROVAL_MESSAGE = "Sending approval email:";
const SENDING_DENIAL_MESSAGE = "Sending denial email:";
const SUCCESS_MESSAGE = "Successfully sent email:";
const FAILED_MESSAGE = "Failed to send email:";

var pubReqEmailWrapper = (() => {

  /**
   * Handles sending the verification code to the user's email
   * 
   * @param {*} fullName The fullname of the user
   * @param {*} email The email of the user
   * @param {*} requestedRecipeName Name of recipe requested to be published
   * @param {*} emailjs The emailjs script
   * @param {*} template The template where this request is from
   * @returns True if the email sent, false otherwise
   */
  function sendPubEmail(fullName, email, requestedRecipeName, emailjs, template) {
    var templateID;

    if (template === APPROVE) {
      templateID = PUB_APPROVE_TEMPLATE_ID;
      console.log(SENDING_APPROVAL_MESSAGE, template);
    } else if (template === DENY) {
      templateID = PUB_DENIED_TEMPLATE_ID;
      console.log(SENDING_DENIAL_MESSAGE, template);
    }

    const params = {
      to_name: fullName,
      requested_recipe: requestedRecipeName,
      user_email: email,
    }

    emailjs.send(SERVICE_ID, templateID, params, PUBLIC_KEY)
      .then(function (response) {
        console.log(SUCCESS_MESSAGE, response.status, response.text);
        return true;
      }, function (error) {
        console.log(FAILED_MESSAGE, error);
      });

    return false;
  }

  return {
    sendPubEmail
  }
})();