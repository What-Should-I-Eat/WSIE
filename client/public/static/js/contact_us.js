$(document).ready(function () {
  $("#contactUsForm").on("submit", async function (event) {
    event.preventDefault();

    try {
      const form = $(this);
      const formArray = form.serializeArray();
      const [firstName, lastName, email, message] = formArray.map(({ value }) => value);
      const fullName = `${firstName} ${lastName}`;

      const contactUs = {
        fullName: fullName,
        email: email,
        message: message
      };

      const response = await fetch(CONTACT_US_URL, {
        method: POST_ACTION,
        body: JSON.stringify(contactUs),
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      console.log(data.success);
      utils.showAjaxAlert("Success", data.success);
    } catch (error) {
      console.error(error);
      utils.showAjaxAlert("Error", error.message);
    }
  });
});