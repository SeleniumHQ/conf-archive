var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function($){
  $(document).ready(function(){
    //console.log('hello divi');
    $('.et_pb_scroll_top').hide();

    $('.js-schedule-content').hide();

    $('#js-toggle-day1').click(function(){
      $(this).toggleClass('schedule-toggler-open');
      $('#js-day1-content').slideToggle();
    });

    $('#js-toggle-day2').click(function(){
      $(this).toggleClass('schedule-toggler-open');
      $('#js-day2-content').slideToggle();
    });

    $('#js-toggle-day3').click(function(){
      $(this).toggleClass('schedule-toggler-open');
      $('#js-day3-content').slideToggle();
    });

    $('.burger').click(function(){
      $('.mobile-nav-links').slideToggle();
    });
    $('.mobile-nav-link').click(function(){
      $('.mobile-nav-links').slideToggle();
    });

    // $('.scroll-link').click(function(e){
    //   // e.preventDefault();
    //   // var $to = $($(this).data('scrollto'));
    //   // console.log($to);
    //   // smoothScroll($to);
    // });

    $('.popup-trigger').click(function(e){
      var who = $(this);
      e.preventDefault();
      generatePopup(who);
    });

    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        hidePopup();
      }
    });

    $('html').attr('style','margin-top:0px!important');
    $('#wpadminbar').remove();


  });

  function showPopup(who) {
    $(who).show();
  }

  function hidePopup(who) {
    $('.scpopup').remove();
    $('.popup-bg').remove();
    $('body').removeClass('noScroll');
  }

  function generatePopup($trigger){

    var popupType = $trigger.data('popup_type');
    //console.log(popupType);

    var $body = $('body');
    var $popupbg = $(document.createElement('div')).addClass('popup-bg');

    var $popup = $(document.createElement('div')).addClass('scpopup');
    var $close = $(document.createElement('div')).addClass('close-popup').html('');
    $popup.append($close);

    var $img = $trigger.find('img');
    var $popupImg = '';

    var popupImgUrl = $trigger.data('popup_img');

    if($img.length > 0 || popupImgUrl){
      var imgSrc = '';
      if(popupImgUrl){
        imgSrc = popupImgUrl;
      } else {
        imgSrc = $img.attr('src')
      }
      $popupImg = $(document.createElement('img')).attr('src',imgSrc).addClass('popup-image');
      $popup.append($popupImg);
      if(popupType == 'sponsor') {
        $popupImg.addClass('popup-image-sponsor');
      }
      if(popupType == 'speaker') {
        $popupImg.addClass('popup-image-speaker');
      }
    } else {
      $popup.addClass('popup-noimg');
    }

    var $titleWrap = $(document.createElement('div')).addClass('popup-titleWrap');
    if($trigger.data('popup_title')){
      var $title = $(document.createElement('p')).html($trigger.data('popup_title')).addClass('popup-title');
      $titleWrap.append($title);
    }
    if($trigger.data('popup_subtitle')){
      var $subtitle = $(document.createElement('p')).html($trigger.data('popup_subtitle')).addClass('popup-subtitle');
      $titleWrap.append($subtitle);
    }
    if($trigger.data('popup_twitter')){
      var handle = $trigger.data('popup_twitter');
      var $twitter = $(document.createElement('a')).text(handle).attr('href','https://web.archive.org/web/20160208223445/https://twitter.com/'+handle).attr('target','_blank').addClass('popup-social').addClass('popup-twitter');
      $titleWrap.append($twitter);
    }

    if($trigger.data('popup_github')){
      var handle = $trigger.data('popup_github');
      var $github = $(document.createElement('a')).text(handle).attr('href','https://web.archive.org/web/20160208223445/https://github.com/'+handle).attr('target','_blank').addClass('popup-social').addClass('popup-github');
      $titleWrap.append($github);
    }

    if($trigger.data('popup_url')){
      var href = $trigger.data('popup_url');
      var text = href.split('//')[1].replace('/','');
      var $url = $(document.createElement('a')).text(text).attr('href',href).attr('target','_blank').addClass('popup-url-sponsor');
      $titleWrap.append($url);
    }

    if(popupType == 'sponsor') {
      $titleWrap.addClass('popup-titleWrap-sponsor');
    }

    $popup.append($titleWrap);

    if($trigger.data('popup_paragraph')){
      var $content = $(document.createElement('p')).html($trigger.data('popup_paragraph')).addClass('popup-content');
      $popup.append($content);
    }
    if($trigger.data('popup_content')){
      var $content = $(document.createElement('p')).html(decodeURI($trigger.data('popup_content'))).addClass('popup-content');
      $popup.append($content);
    }


    //create the socials
    //github


    $body.append($popupbg).append($popup).addClass('noScroll');


    $('.close-popup').click(function(){
      hidePopup();
    });

    $('.popup-bg').click(function(){
      hidePopup();
    });
    window.setTimeout(function(){
      $('.popup-bg').addClass('popup-bg--active');
    }, 0);



  }

  //already taken care of by divi?
  // function smoothScroll($to) {
  //   var maxScroll = $('body').height() - $(window).height();// -10;
  //   console.log('maxScroll' + maxScroll);

  //   if($to.length > 0){
  //     var howFar = $to.offset().top;
  //     if(howFar > maxScroll) {
  //       howFar = maxScroll
  //     }
  //     console.log(howFar);
  //     $('body').animate({
  //       scrollTop: howFar
  //     }, 1000);
  //     return false;
  //   }
  // }

})(jQuery);

}
/*
     FILE ARCHIVED ON 22:34:45 Feb 08, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 10:19:13 Apr 04, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.836
  exclusion.robots: 0.023
  exclusion.robots.policy: 0.009
  esindex: 0.018
  cdx.remote: 100.705
  LoadShardBlock: 126.826 (3)
  PetaboxLoader3.datanode: 176.484 (6)
  load_resource: 140.585
  PetaboxLoader3.resolve: 78.464
*/