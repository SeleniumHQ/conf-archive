// // Always make page reload starts at top
// // There's surely a better way interim solution to prevent odd issue of 'fixed' #siteWrap when page is reloaded while within prefooter/footer
// if (history.scrollRestoration) {
//   history.scrollRestoration = 'manual';
// } else {
//   window.onbeforeunload = function () {
//     window.scrollTo(0, 0);
//   }
// }