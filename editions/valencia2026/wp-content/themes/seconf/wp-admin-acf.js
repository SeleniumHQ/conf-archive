jQuery(document).ready(function($) {

  // close ACF accordions on page load (:not.inside added to prevent from this happening to accordions )
  // $('.acf-accordion .acf-field-accordion').removeClass('-open');
  // $('.acf-accordion .acf-accordion-title .dashicons-arrow-down').removeClass('dashicons-arrow-down').addClass('dashicons-arrow-right');
  // $('.acf-accordion .acf-accordion-content').css('display', 'none');

  // Remove text when no media image has been chosen/uploaded yet
  // via support.advancedcustomfields.com/forums/topic/remove-no-image-selected-text-from-image-uploader/
  $(".acf-image-uploader p").each(function(){
    $(this).replaceWith($(this).html().replace("No image selected", ""));
  });

});