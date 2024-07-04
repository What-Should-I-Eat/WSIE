"use strict";

var restrictions = function () {
  var selectedRestrictions = []; //array of restrictions that the user chose

  var handleRestrictions = function handleRestrictions() {
    console.log('handling restrictions');
    var restrictionButtons = document.querySelectorAll('.restrictions-container button');
    restrictionButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        button.classList.toggle('selected'); // Check if the button is selected or deselected

        if (button.classList.contains('selected')) {
          // If selected, add the button text to the array
          selectedRestrictions.push(button.textContent.trim());
          console.log('added ', button.textContent, ' to restrictions');
        } else {
          // If deselected, remove the button text from the array
          var index = selectedRestrictions.indexOf(button.textContent.trim());

          if (index !== -1) {
            selectedRestrictions.splice(index, 1);
          }
        } // Log the array of selected restrictions


        console.log('Selected Restrictions:', selectedRestrictions);
      });
    });
  };

  var getSelectedRestrictions = function getSelectedRestrictions() {
    return selectedRestrictions;
  };

  return {
    handleRestrictions: handleRestrictions,
    getSelectedRestrictions: getSelectedRestrictions
  };
}();