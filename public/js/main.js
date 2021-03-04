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

  (function () {
    'use strict';
    window.addEventListener('load', function () {
      let forms = document.getElementsByClassName('needs-validation');

      for (let i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', function (event) {
          if (forms[i].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          forms[i].classList.add('was-validated');
        }, false);
      }
    }, false);
  })();

})(jQuery); // End of use strict
