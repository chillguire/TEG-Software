(function ($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggleTop").on('click', function (e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // autogrown text area
  const textArea = document.getElementsByTagName('textarea');
  for (let i = 0; i < textArea.length; i++) {
    textArea[i].setAttribute('style', 'height:' + (textArea[i].scrollHeight) + 'px;overflow-y:hidden;');
    textArea[i].addEventListener("input", OnInput, false);
  }
  function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  }

  // form validation
  (function () {
    'use strict';
    window.addEventListener('load', function () {
      let forms = document.getElementsByClassName('needs-validation');

      if (forms) {
        for (let i = 0; i < forms.length; i++) {
          forms[i].addEventListener('submit', function (event) {
            if (forms[i].checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            forms[i].classList.add('was-validated');
          }, false);
        }
      }

    }, false);
  })();

})(jQuery); // End of use strict
