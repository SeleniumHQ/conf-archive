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

/*global jQuery */
/*jshint multistr:true browser:true */
/*!
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
	var settings = {
	  customSelector: null
	};

	if(!document.getElementById('fit-vids-style')) {

	  var div = document.createElement('div'),
		  ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];

	  div.className = 'fit-vids-style';
	  div.id = 'fit-vids-style';
	  div.style.display = 'none';
	  div.innerHTML = '&shy;<style>         \
		.fluid-width-video-wrapper {        \
		   width: 100%;                     \
		   position: relative;              \
		   padding: 0;                      \
		}                                   \
											\
		.fluid-width-video-wrapper iframe,  \
		.fluid-width-video-wrapper object,  \
		.fluid-width-video-wrapper embed {  \
		   position: absolute;              \
		   top: 0;                          \
		   left: 0;                         \
		   width: 100%;                     \
		   height: 100%;                    \
		}                                   \
	  </style>';

	  ref.parentNode.insertBefore(div,ref);

	}

	if ( options ) {
	  $.extend( settings, options );
	}

	return this.each(function(){
	  var selectors = [
		"iframe[src*='player.vimeo.com']",
		"iframe[src*='youtube.com']",
		"iframe[src*='youtube-nocookie.com']",
		"iframe[src*='kickstarter.com'][src*='video.html']",
		"object",
		"embed"
	  ];

	  if (settings.customSelector) {
		selectors.push(settings.customSelector);
	  }

	  var $allVideos = $(this).find(selectors.join(','));
	  $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

	  $allVideos.each(function(){
		var $this = $(this);
		if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
		var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
			width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
			aspectRatio = height / width;
		if(!$this.attr('id')){
		  var videoID = 'fitvid' + Math.floor(Math.random()*999999);
		  $this.attr('id', videoID);
		}
		$this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
		$this.removeAttr('height').removeAttr('width');
	  });
	});
  };
})( jQuery );

}
/*
     FILE ARCHIVED ON 11:41:50 Dec 22, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 10:18:59 Apr 04, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.575
  exclusion.robots: 0.022
  exclusion.robots.policy: 0.01
  esindex: 0.014
  cdx.remote: 11.056
  LoadShardBlock: 219.207 (3)
  PetaboxLoader3.datanode: 231.806 (6)
  load_resource: 291.212
  PetaboxLoader3.resolve: 200.866
*/