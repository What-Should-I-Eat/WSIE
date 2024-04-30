document.addEventListener("DOMContentLoaded", function () {
  function formHasChanges(form) {
    let hasChanges = false;

    form.find("input, select").each(function () {
      // Don't check submit types or fields that are marked as disabled (ex. usernames)
      if (this.type === "submit" || this.disabled) {
        return;
      }

      let initialValue = $(this).data("initial-value");
      let currentUserInput;

      // If its a selection option, get the selected option otherwise get the value
      if ($(this).is("select")) {
        currentUserInput = $(this).find("option:selected").val();
      } else {
        currentUserInput = $(this).val();
      }

      // Check if initial value is a number
      if (!isNaN(initialValue)) {
        initialValue = initialValue.toString();
      }

      if (currentUserInput !== initialValue) {
        hasChanges = true;
      }
    });

    return hasChanges;
  }

  $(
    "#updateMyInfoForm, #updateEmailAddressForm, #updatePasswordForm"
  ).submit(function (event) {
    event.preventDefault();

    var form = $(this);
    const userId = form.data("user-id");
    const actionUrl = form.attr("action");

    if (!formHasChanges(form)) {
      alert("There is nothing to update.");
      return;
    }

    console.log("Update UserId:", userId);
    console.log("Posting to URL:", actionUrl);
    console.log("Form:", form);

    $.ajax({
      url: actionUrl + `?user_id=${userId}`,
      type: "POST",
      data: form.serialize(),
      success: function (response) {
        console.log("Updated successfully");
        $('#ajaxSuccessMessage').text(response.success);
        $('#ajaxAlertSuccess').show();
      },
      error: function (xhr) {
        console.error("Error Occurred:", xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        $('#ajaxErrorMessage').text(response.error);
        $('#ajaxAlertError').show();
      }
    });
  });
});
