// All this is doing is inserting the parse API keys into every $.ajax
// request that you make so you don't have to.

// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  // jqXHR.setRequestHeader('X-Parse-Application-Id', '2745f6eedad1770c6ebaf03f8a97cf0cc2f66706');
  // jqXHR.setRequestHeader('X-Parse-REST-API-Key', '4f44a6835e581124936858b658e8ea99e278d371');
});
