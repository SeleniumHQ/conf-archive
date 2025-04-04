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
    checkForLazyness();
    $('.sneaky-load').each(function(){
      cacheBust($(this));
    });
  });

  $(window).scroll(function(){
    checkForLazyness();
  });

  function checkForLazyness() {
    $('.sneaky-load').each(function(){
      if(inView($(this)[0].getBoundingClientRect())){
        console.log('found one in view');
        showTheImage($(this));
      } else {
        console.log('not in view');
      }
    });
  }

  function inView(coords) {
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight));
  }

  function showTheImage($img) {

    $img.removeClass('sneaky-load');

  }

  function cacheBust($img) {
    var src = $img.attr('src');
    $img.attr('src',src + '?t=' + Math.random());
  }

})(jQuery);

}
/*
     FILE ARCHIVED ON 10:59:44 Dec 11, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 10:18:51 Apr 04, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.835
  exclusion.robots: 0.027
  exclusion.robots.policy: 0.012
  esindex: 0.013
  cdx.remote: 12.303
  LoadShardBlock: 85.54 (3)
  PetaboxLoader3.datanode: 71.245 (4)
  PetaboxLoader3.resolve: 74.255 (2)
  load_resource: 66.974
*/