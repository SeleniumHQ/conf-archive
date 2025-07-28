// HEADS UP
// theme toggling JS is inlined within buttons-stickybottom.php so it loads as quickly as possible to prevent FOUT


/* GLOBAL VARS ----------------------------------------- */

const html       = document.querySelector('html');
const siteWrap   = document.querySelector('#siteWrap');
const footerWrap = document.querySelector('#footerWrap');


/* GLOBAL FUNCTIONS ----------------------------------------- */

/* FOR FIXED FOOTER ---------- */
function fixSiteWrap(){
  // only fix section if we are coming from above
  const withinSiteWrap = html.classList.contains('withinSiteWrap');
  if (withinSiteWrap){
    // fix #siteWrap and add it's height to #footerWrap as padding so page doesn't jump
    const siteWrapHeight = siteWrap.offsetHeight;
    siteWrap.style.cssText = 'position: fixed; left: 0; right: 0; bottom: 0;';
    footerWrap.style.cssText = 'padding-top: '+siteWrapHeight+'px';
  }
}
function unfixSiteWrap(){
  // put it back
  siteWrap.style.cssText = '';
  footerWrap.style.cssText = '';
}


/* -------------------------------------------------
TALKBOXES
Convert dates/times based on json data, set attrs, etc.
---------------------------------------------------- */

var talkbox = document.querySelectorAll('[data-timeslot]');

talkbox.forEach(function (timeslot, i) {

  // get the value of json items printed in data attributes 
  const givenTimeslot = timeslot.dataset.timeslot; // data-timeslot="{timeslot}"
  const givenDuration = timeslot.dataset.duration; // data-duration="{duration}"

  // normalize to be converted with toLocaleString (stackoverflow.com/a/5324266/2157742)
  const arr = givenTimeslot.split(/[- :]/);
  const timeToConvert = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

  // formats we want to display
  const options_day  = { weekday: 'long' };
  const options_dayabbr  = { weekday: 'short' };
  const options_time = { hour: '2-digit', minute: '2-digit' };
  const options_time24 = { hour12: false, timeStyle: 'short' };

  // convert to our preferred formats
  const startTime = timeToConvert.toLocaleString('en-US', options_time);
  const dayName   = timeToConvert.toLocaleString('en-US', options_day);
  const dayNameAbbr = timeToConvert.toLocaleString('en-US', options_dayabbr);
  const endDateMs = new Date(timeToConvert.getTime() + givenDuration*60000); // convert to milliseconds
  const endTime   = endDateMs.toLocaleString('en-US', options_time);
  // 24hr time without colons for grid placement
  const startTime24 = timeToConvert.toLocaleString('en-US', options_time24).replaceAll(":", "");
  const endTime24   = endDateMs.toLocaleString('en-US', options_time24).replaceAll(":", "");
  
  // set attributes in the DOM
  talkbox[i].setAttribute('data-day', dayName); 
  talkbox[i].setAttribute('data-time-start', startTime);
  talkbox[i].setAttribute('data-time-end', endTime); 
  
  // if we are within a timed schedule layout
  const sched = talkbox[i].closest('.agenda-style-sched');
  if (Boolean(sched)){
    // set grid-row positiong (rounding to increments of 10 to match the named grid-template-rows in _agenda.scss)
    talkbox[i].style.gridRowStart = 'time-'+Math.round(startTime24 / 10) * 10;
    talkbox[i].style.gridRowEnd   = 'time-'+Math.round(endTime24 / 10) * 10;
  }

  // set day within elements
  const loadDay = talkbox[i].querySelectorAll('.js-loadDay');
  loadDay.forEach(function (eachLoadDay, i) {
    eachLoadDay.innerText = dayNameAbbr;
  });

  // set start time within elements
  const loadTimeStarts = talkbox[i].querySelectorAll('.js-loadTimeStart');
  loadTimeStarts.forEach(function (eachLoadTimeStart, i) {
    eachLoadTimeStart.innerText = startTime;
  });
  
  // set end time within elements
  const loadTimeEnds = talkbox[i].querySelectorAll('.js-loadTimeEnd');
  loadTimeEnds.forEach(function (eachLoadTimeEnd, i) {
    eachLoadTimeEnd.innerText = endTime;
  });

  // special format for keynotes on agenda
  if(talkbox[i].classList.contains('agenda-single') && talkbox[i].dataset.session_type == 'Keynote'){

    let inner          = talkbox[i].querySelector('.talkbox-inner');
    let title          = talkbox[i].querySelector('.talk-title');
    let speakers       = talkbox[i].querySelector('.speaker-names');
    let spkrNames      = talkbox[i].querySelector('.popbox-inner .speaker-names');
    let spkrNamesCopy  = spkrNames.cloneNode(true);
    let spkrPhotos     = talkbox[i].querySelector('.popbox-inner .speaker-photos');
    let spkrPhotosCopy = spkrPhotos.cloneNode(true);
    let badge          = talkbox[i].querySelector('.talk-meta-badge');
    let abstract       = talkbox[i].querySelector('.talk-abstract');
    let meta           = talkbox[i].querySelector('.talk-meta');
    let metaCopy       = meta.cloneNode(true);
    
    inner.classList.add('talkbox-inner-layout-keynote');

    let keynote_details = document.createElement('div');
    keynote_details.className = 'keynote-details';
    
    let keynote_blurb = document.createElement('div');
    keynote_blurb.className = 'keynote-blurb';

    let keynote_speakers = document.createElement('div');
    keynote_speakers.className = 'keynote-speakers';

    speakers.parentNode.removeChild(speakers);

    inner.append(keynote_details);
    inner.append(keynote_blurb);
    inner.append(keynote_speakers);

    keynote_details.append(title);
    keynote_details.append(badge);
    keynote_details.append(metaCopy);

    keynote_blurb.append(abstract);
    
    keynote_speakers.append(spkrPhotosCopy);
    keynote_speakers.append(spkrNamesCopy);

  }


});


// SORT TALKS BY TIMESLOT (AND TRACK)
// stackoverflow.com/a/41439375/2157742
// stackoverflow.com/a/46256174/2157742

var agendalist = document.querySelectorAll('.js-sortAgenda');
agendalist.forEach(function (agendalist, i) {
  Array.from(agendalist.children)
    .sort(function(a, b) {
      return sortTimeslot(a) - sortTimeslot(b) || sortTrack(a) - sortTrack(b);
    }).forEach(function(ele) {
      agendalist.appendChild(ele);
    })
  function sortTimeslot(ele) {
    if (ele.dataset.timeslot){
      return Number(ele.dataset.timeslot.replace(/\D/g, '')) || 0;
    }
  }
  function sortTrack(ele) {
    if (ele.dataset.track){
      return Number(ele.dataset.track.replace(/\D/g, '')) || 0;
    }
  }
});


// GENERATE TIME LABELS (FOR MOBILE ONLY)
// Mobile schedule isn't proportional like desktop, so we need to place them before each event that is within a new hour

// Get all the time slots
const timeSlots = document.querySelectorAll('.agenda-style-sched [data-timeslot]');

// Initialize variables for tracking the current date and hour
let currentDate = null;
let currentHour = null;

// Loop through each time slot
timeSlots.forEach((timeSlot) => {
  // Get the time slot's date and hour
  const date = timeSlot.dataset.day;
  const dateTime = new Date(timeSlot.dataset.timeslot);
  const hour = dateTime.getHours();

  // If the date has changed, reset the current hour to null
  if (date !== currentDate) {
    currentHour = null;
    currentDate = date;
  }

  // If the hour is different from the current hour, add a new time element
  if (hour !== currentHour) {
    const formattedHour = formatHour(hour);
    const time      = document.createElement('time');
    const timeInner = document.createElement('span');
    time.appendChild(timeInner);
    time.classList.add('agenda-time-mobile')
    timeInner.innerText = formattedHour;
    timeSlot.insertAdjacentElement('beforebegin', time);
    currentHour = hour;  
  }

});

// Helper function to format the hour
function formatHour(hour) {
  let formattedHour = '';
  if (hour === 0) {
    formattedHour = '12:00 AM';
  } else if (hour < 12) {
    formattedHour = `${hour}:00 AM`;
  } else if (hour === 12) {
    formattedHour = '12:00 PM';
  } else {
    formattedHour = `${hour - 12}:00 PM`;
  }
  return formattedHour;
}

// add one at the end so the last one has an endTrigger to work off of
const schedAgendaLists = document.querySelectorAll('.agenda-style-sched .agenda-list');
schedAgendaLists.forEach((schedAgendaList) => {
  lastTime = document.createElement('time');
  lastTime.classList.add('agenda-time-mobile');
  schedAgendaList.appendChild(lastTime);
});



/* -------------------------------------------------
GSAP / SCROLLTRIGGER
---------------------------------------------------- */
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);


/* PAGE HEROES ---------- */

gsap.utils.toArray('.hero').forEach((section, i) => {  
  section.item = section.querySelector('.hero-bg, lottie-player');
  gsap.to(section.item, {
    y: '10%',
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    opacity: 0
  });
});


/* BIG HEROES (HOME) ---------- */
const bighero = document.querySelector('[data-section="bighero"]');

// CONTAINER (fade out, desk only so we don't fade out info box on mobile)
ScrollTrigger.matchMedia({
  "(min-width: 64rem)": function() {
  gsap.utils.toArray('.bighero-inner').forEach((section, i) => {  
    gsap.to(section, {
      ease: "none",
      scrollTrigger: {
        trigger: bighero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      opacity: 0
    });
  });
  }
});
  

// BOTTOM LAYER (map) — DESKTOP
gsap.utils.toArray('.bighero-inner .bighero-art-bottom').forEach((section, i) => {  
  gsap.to(section, {
    y: '20%',
    ease: "none",
    scrollTrigger: {
      trigger: bighero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

});

// TOP LAYER (text) — DESKTOP
gsap.utils.toArray('.bighero-inner.bighero-art-top').forEach((section, i) => {  
  gsap.to(section, {
    y: '30%',
    ease: "none",
    scrollTrigger: {
      trigger: bighero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

});


/* 'FIXED' PREFOOTER/FOOTER TO OVERLAP PAGE CONTENT ---------- */

// First, a trigger for confirming we are scrolling down from #sitewrap (otherwise if page is reloaded while we are within #footerWrap it'll trap us)
gsap.utils.toArray('#siteWrap').forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom top',
    toggleClass: { targets: 'html', className: 'withinSiteWrap' },
    // markers: true
  });
});

// Now fix the footer
gsap.utils.toArray('#footerWrap').forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    toggleClass: { targets: 'html', className: 'withinFooterWrap' },
    // onEnter     : self => fixSiteWrap(),
    // onLeaveBack : self => unfixSiteWrap(),
    // onEnterBack and onLeave not needed because we don't go lower than these
    // markers: true
  });
});


/* STICKYBOTTOM BUTTONS HIDE ON HOMEPAGE UNTIL SCROLLED PAST HERO ---------- */

document.querySelectorAll('body.home [data-section="bighero"]').forEach(section => {

  ScrollTrigger.matchMedia({
    "(max-width: 63.999rem)": function() {

      ScrollTrigger.create({
        trigger: section,
        start: 'top-=100 top',
        end: 'bottom bottom',
        toggleClass: { targets: 'html', className: 'withinHomeHero' },
        // markers: true
      });
    }
  });

});


/* AGENDA MOBILE TIMES ---------- */

// helper to get next sibling of particular attribute
// via gomakethings.com/finding-the-next-and-previous-sibling-elements-that-match-a-selector-with-vanilla-js/
var getNextSibling = function (elem, selector) {
	var sibling = elem.nextElementSibling;
	if (!selector) return sibling;
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.nextElementSibling
	}
};

document.querySelectorAll('.agenda-time-mobile').forEach(section => {

  const nextSection = getNextSibling(section, '.agenda-time-mobile');

  ScrollTrigger.create({
    trigger: section,
    endTrigger: nextSection,
    start: 'top top+=130',
    end: 'top top+=230',
    toggleClass: 'enteredHour',
    pin: section,
    // pinSpacing: false,
    // markers: true
  });

});


/* AGENDA FILTERS ---------- */

document.querySelectorAll('.agenda-filters').forEach(section => {

  ScrollTrigger.create({
    trigger: '.agenda-inner',
    start: 'top top',
    end: 'bottom bottom',
    toggleClass: { targets: 'html', className: 'agendaFiltersFixed' },
    pin: section,
    pinSpacing: false,
    // markers: true
  });

});


/* AGENDA BG ---------- */

document.querySelectorAll('.agenda-bg').forEach(section => {

  ScrollTrigger.create({
    trigger: '.agenda-main',
    start: 'top top',
    end: 'bottom bottom-=1000', // never hits
    pin: section,
    pinSpacing: false,
    // markers: true
  });

});


/* COPY TO CLIPBOARD ---------- */
  
const copyButton = document.querySelectorAll('[data-copy-url]');

copyButton.forEach(function (clickedButton) {

  const copyStatus = clickedButton.querySelector('[data-copy-status]');
  const copyStatusInner = copyStatus.querySelector('div');

  clickedButton.addEventListener("click", () => {

    const text = window.location.href;
    
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      
      navigator.clipboard.writeText(text).then(() => {
        
        copyStatus.classList.add('open');

        setTimeout(function(){
          copyStatus.classList.add('gone');
        }, 1500);
        
        setTimeout(function(){
          copyStatus.classList.remove('open');
          copyStatus.classList.remove('gone');
        }, 2000);

      });

    } else {

      copyStatus.innerHTML = 'Error copying URL'
      
    }

  });

});


/* -------------------------------------------------
jQ :|
---------------------------------------------------- */

jQuery(document).ready(function($) {
  
  $sizeChecker = $('#sizeChecker');

  /* HOTFIX TO REMOVE DOUBLE DOUBLEQUOTES WITHIN AGENDA DESCRIPTION A HREFS (appearing as href=""https://link.com"") ----------------------------------------- */
  $('.talk-content a').each(function() {
    
    var newHref = $(this).attr('href');
    
    // replace extra quotes with nothing
    newHref = newHref.replace('"','');
    newHref = newHref.replace('"','');
    $(this).attr('href', newHref);

    // make sure we have target blank
    $(this).attr('target', '_talklink');

  });

  /* SPACER TO PUSH CONTENT BELOW NAV ----------------------------------------- */

  function sizeHeaderSpacer(){
  
    var stickyHeaderHeight = $('#stickyHeader').outerHeight();
    var stickyHeaderSpacer = $('#stickyHeaderSpacer');

    // Set spacer to be same height as header
    stickyHeaderSpacer.height(stickyHeaderHeight);

  }
  sizeHeaderSpacer(); // Window resize functions run at bottom also


  /* TALKBOX ACTIONS ----------------------------------------- */

  $('.talkbox').each(function() {

    // data
    var speakerName  = $(this).find('.js-speakerName');
    var speakerOrg   = $(this).find('.js-speakerOrg');
    var coSpeaker    = $(this).find('.js-coSpeaker');
    var speakerPhoto = $(this).find('.js-speakerPhoto');
    var popBox       = $(this).find('.popbox');
    
    // containers
    var speakerNamesContainer = $(this).find('.js-loadSpeakerNames');
    var speakerNamesTalkboxContainer = $(this).find('.speaker-names-talkbox.js-loadSpeakerNames');
    var speakerNamesPopboxContainer = $(this).find('.speaker-names-popbox.js-loadSpeakerNames');
    var speakerPhotosContainer = $(this).find('.js-loadSpeakerPhotos');

    // place names
    $(speakerName).each(function() {
      speakerNamesContainer.append($(this));
    });
    
    // place photos
    $(speakerPhoto).each(function() {
      speakerPhotosContainer.append($(this));
    });
    
    // if no copresenters
    if($(coSpeaker).length === 0){
      $(this).attr('data-has-copresenters', false);
      popBox.attr('data-has-copresenters', false);
      // place main speaker company name
      speakerNamesContainer.append(speakerOrg);
    } else {
      $(this).attr('data-has-copresenters', true);
      popBox.attr('data-has-copresenters', true);
    }

  });


  /* SPEAKER POPBOX ACTIONS ----------------------------------------- */

  const speakerPopboxes = document.querySelectorAll('[data-section="speakers"] .popbox');

  speakerPopboxes.forEach(function (popbox, i) {

    // speaker id
    const key = popbox.dataset.speakerKey;
    
    // container to place speakers talk titles
    const container = popbox.querySelector('.js-speakerTalks');

    // talks that match speaker id
    const talk = document.querySelectorAll('#talksToPairWithSpeakers [data-speakers*="'+key+'"]');

    // copresented talks that match speaker id
    const cotalk = document.querySelectorAll('#talksToPairWithSpeakers [data-copresenter*="'+key+'"]');

    // if there are matches, add a heading to the container
    if (talk){ container.innerHTML += '<strong>Talks</strong><br>'; }

    // add talks to container
    talk.forEach(function(talk, i) {
      const title = talk.dataset.title;
      const key = talk.dataset.key;
      container.innerHTML += '<a href="/agenda/#'+key+'" class="button-underlined button-icon-arrow">'+title+'</a><br>';
    });

    // add cotalks to container
    cotalk.forEach(function(cotalk, i) {
      const title = cotalk.dataset.title;
      const key = cotalk.dataset.key;
      container.innerHTML += '<a href="/agenda/#'+key+'" class="button-underlined button-icon-arrow">'+title+'</a><br>';
    });

  });


  /* SELECTRIC.JS ----------------------------------------- */
  
  /* AGENDA DAY PICKER (mobile only) ---------- */
  
  function runSelectricOnAgendaPicker(){
    if ( $('#sizeChecker').css('display') == 'none' ) {
      // mobile
      $('.day-picker').selectric({
        arrowButtonMarkup: '<svg class="selectric-filter-icon" style="margin-right: 1rem; width: 15px;" fill="none" height="13" viewBox="0 0 11 13" width="11" xmlns="http://www.w3.org/2000/svg"><path d="m.944 7.46956 4.736 4.73604 4.736-4.73604-1.016-1-2.8 2.84h-.208l.04-8.511997h-1.504l.04 8.511997h-.208l-2.8-2.84z" fill="#92a7a5"/></svg>',
        nativeOnMobile: false,
      });
    } else {
      // desktop
      if ($('.selectric-day-picker').length > 0){
        $('.day-picker').selectric('destroy');
      }
    }
  }
  runSelectricOnAgendaPicker();

  // on select — open correct day
  $('.day-picker').on('selectric-change', function(event, element, selectric) {
    const toOpen = selectric.items[selectric.state.selectedIdx].value;
    $('#'+toOpen).click();
  });


  /* AGENDA TAGS DROPDOWN ---------- */

  // First, remove duplicates
  const tags = [...document.querySelectorAll('.agenda-tags option')];
  const texts = new Set(tags.map(x => x.innerHTML));
  tags.forEach(tag => {
    if(texts.has(tag.innerHTML)){
      texts.delete(tag.innerHTML);
    } else{
      tag.remove()
    }
  })
  // run selectric
  function runSelectricOnAgendaTags(){
    $('.agenda-tags').selectric({
      arrowButtonMarkup: '<svg class="selectric-filter-icon" style="margin-right: 1rem; width: 15px;" fill="none" height="13" viewBox="0 0 11 13" width="11" xmlns="http://www.w3.org/2000/svg"><path d="m.944 7.46956 4.736 4.73604 4.736-4.73604-1.016-1-2.8 2.84h-.208l.04-8.511997h-1.504l.04 8.511997h-.208l-2.8-2.84z" fill="#92a7a5"/></svg>',
      nativeOnMobile: false,
      expandToItemText: true, // expands visible to length of chosen option
      // inheritOriginalWidth: true, // expands visible to longest child
    });
  }
  runSelectricOnAgendaTags();

  // on select — add class to filtered out items
  $('.agenda-tags').on('selectric-change', function(event, element, selectric) {
    const filterBy = selectric.items[selectric.state.selectedIdx].value;
    $('.agenda-single').removeClass('talkbox-dim');
    $('.agenda-single:not([data-tags*="'+filterBy+'"])').addClass('talkbox-dim');
  });


  /* STICKY HEADER ON PAGE SCROLL UP ----------------------------------------- */

  // Detect if scrolled up or down
  // via silvawebdesigns.com/detect-scroll-event-jquery/
  var lastScrollTop = 0,
      delta = 10,
      html = $('html');

  $(window).scroll(function(){
    
    var nowScrollTop = $(this).scrollTop();
    // console.log('lastScrollTop = '+lastScrollTop+' nowScrollTop = '+nowScrollTop);
    
    if(nowScrollTop < 100) {
      html.addClass('atOrNearTop');
      unfixSiteWrap(); // fix for odd issue of page getting stuck when refreshed within prefootter/footer area
    } else {
      html.removeClass('atOrNearTop');
    }

    if(Math.abs(lastScrollTop - nowScrollTop) >= delta){

      if (nowScrollTop > lastScrollTop){
        // scrolled down
        html.removeClass('scrolledUp').addClass('scrolledDown');
      } else {
        // scrolled up
        html.removeClass('scrolledDown').addClass('scrolledUp');
      }
      lastScrollTop = nowScrollTop;

    }
  });


  /* MOBILE NAV TOGGLER ----------------------------------------- */

  function navMenuOpener() {
    $('html').removeClass('navMenuClosed').addClass('navMenuOpen');
    $('#stickynav-menu-toggle').attr('aria-expanded', true);
    $.scrollLock(true);
    // have nav fill rest of viewport height so it can be scrollable on mobile if taller than viewport
    $navMenu   = $('#stickynav-menu');
    $winHeight = $(window).height();
    $navMenu.css('height', ($winHeight));
  }
  
  function navMenuCloser() {
    $navMenu   = $('#stickynav-menu');
    $navMenu.css('height', 'auto');
    $('html').addClass('navMenuClosed').removeClass('navMenuOpen');
    $('#stickynav-menu-toggle').attr('aria-expanded', false);
    $.scrollLock(false);
    // keepNavVisible because menu close triggers scroll up/down logic to report as scrolled down, hiding nav
    $('html').addClass('keepNavVisible');
    setTimeout(function(){
      $('html').removeClass('keepNavVisible');
    }, 2000);
  }

  $('#stickynav-menu-toggle').on('click', function() {

    if ( $(this).attr('aria-expanded') === "false") {
      navMenuOpener();
    } else {
      navMenuCloser();
      sizeHeaderSpacer();
    }

  });

  
  /* ACTIONS ON ESC KEY PRESS ----------------------------------------- */

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { 
      if ( $('html').hasClass('navMenuOpen') ){
        navMenuCloser();
      }
    }
  });


  /* MAKE IMAGES BLEED ----------------------------------------- */

  // Pull contained element to LEFT screen edge
  function pullAbsoluteToScreenEdgeLeft(){

    $('.js-pullAbsoluteToScreenEdgeLeft').each(function() {    
      // reset
      $(this).css('left', '0');
      // get position from screen edge
      var offset = $(this).offset();
      // close any gap
      $(this).css('left', '-'+offset.left+'px');
    });

  }
  pullAbsoluteToScreenEdgeLeft();

  // Pull contained element to RIGHT screen edge
  function pullAbsoluteToScreenEdgeRight(){
    

    $('.js-pullAbsoluteToScreenEdgeRight').each(function() {    

      var windowWidth = window.innerWidth;
      var offset = $(this).offset();
      var offsetLeft = offset.left;
      var elemWidth = $(this).width();
      var pullAmtRight = windowWidth - offsetLeft - elemWidth;

      // reset
      $(this).css('right', '0');
      // get position from screen edge
      var offset = $(this).offset();
      // close any gap
      $(this).css('right', '-'+pullAmtRight+'px');
    });

  }
  pullAbsoluteToScreenEdgeRight();


  /* ACCORDION ----------------------------------------- */

  $('body').on('click', '[data-accordion-opener=""]', function() {

    $trigger = $(this).attr('aria-controls');

    // open content
    $speed = $(this).attr('data-accordion-speed');
    if ($speed && $speed.length > 0) {
      $speed = parseInt($speed);
    } else {
      $speed = 500;
    }
    $('#'+$trigger).slideToggle($speed);

    // update aria and text on button  
    if ( $(this).attr('aria-expanded') === "false") {
      $(this).attr('aria-expanded', true);
    } else {
      $(this).attr('aria-expanded', false);
    }

    ScrollTrigger.refresh();

  });


  /* TABS ----------------------------------------- */

  $('body').on('click', '[data-tab-opener]', function() {

    $trigger = $(this).attr('aria-controls');
  
    if ( $(this).attr('aria-selected') === "false") {
  
      // inactive items
      $(this).siblings().attr('aria-selected', false);
      $(this).siblings().removeClass('active');
      $('#'+$trigger).siblings().hide();
      // active item
      $(this).attr('aria-selected', true);
      $(this).addClass('active');
      $('#'+$trigger).show();
  
    }

    ScrollTrigger.refresh();
  
  });


  /* AGENDA TABS -------- */

  $('body').on('click', '.agenda-filters [data-tab-opener]', function() {
    const html = document.querySelector('html');
    // scroll to agenda container (but only if 'preventScrollEffects' not set on HTML, which is to prevent js-triggered click on load within conf-agenda.php)
    if (html.classList.contains('preventScrollEffects') !== true){
    // if (html.classList.contains('agendaFiltersFixed')){
      gsap.to(window, { duration: .5, scrollTo:{y:'[data-section="agenda"]', offsetY: 0 } });
    }
  });


  /* RUN WINDOW RESIZE FUNCTIONS ----------------------------------------- */
  // But only on *width* changes so scrolling on mobile doesn't trigger w/ URL bar movement
  // Alernative to $(window).resize(function);
  var $window = $(window);
  var lastWindowWidth = $window.width();
  $window.resize(function () {

    var windowWidth = $window.width();
    if (lastWindowWidth !== windowWidth) {
      
      // Our "on resize" functions:
      navMenuCloser();
      sizeHeaderSpacer();
      pullAbsoluteToScreenEdgeLeft();
      pullAbsoluteToScreenEdgeRight();
      runSelectricOnAgendaPicker();
      lastWindowWidth = windowWidth;
    }
    
  });
  
});