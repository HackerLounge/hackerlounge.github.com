$(function() {
  //addSubscribeHandler();

  if ($('body').attr('id') == 'home') {
    addDateHighlighter('.events', 'events');
    addDateHighlighter('.techtalks', 'speakers');
  }
});

function addSubscribeHandler() {
  $('.subscribe').click(function(e) {
    $('.subscribeBox').slideDown();
    e.preventDefault();
  });

  $('.subscribeBox').submit(function(e) {
    $('.subscribeBox [type="submit"]').attr('disabled', 'disabled');

    var url = 'http://hackut.us5.list-manage.com/subscribe/post?u=ad5cbe74e8c05f4b8c61f896c&amp;id=0e1faa67d8';

    $.ajax(url, {
      dataType: "jsonp",
      type: "POST",
      data: {
        EMAIL: $('.subscribeBox [name="email"]').val()
      }
    });
    
    /* Hacky (we always say success, jsonp will get an error) */
    $('.subscribeBox').slideUp(function() {
      $('.subscribeBox')
        .empty()
        .html('<h2 style="color: green;">Success! Click the link in your email to confirm.</h2>')
        .slideDown();
    });
    

    e.preventDefault();
    e.stopPropagation();
    return false;
  });
}

/**
 * Makes past events (on the homepage) dim, so that we can keep them
 * there, but make them stand out less.
 */
function addDateHighlighter(selector, pastType) {
  var DAY = 1000 * 60 * 60 * 24;
  var isPast = false;
  var numOld = 0;
  var currentYear;

  var helper = function() {
    if (numOld > 0) {
      var $oldMsg = $('<span class="oldMsg">Show <strong>'+numOld+'</strong> past '+pastType+' this quarter...</span>');
      var $quarterEvents = $(selector).find('[data-year='+currentYear+']').first();

      $oldMsg.click(function(e) {
        $quarterEvents.find('.oldMsg').remove();
        $quarterEvents.nextAll().each(function(i, e) {
          var $e = $(e);
          if ($e.is('h2')) {
            return false; // stop execution
          }
          if ($e.is('.old')) {
            $e.removeClass('old');
            $e.fadeIn();
          }
        });
      });
      $quarterEvents.append($oldMsg);
    }
  }

  $(selector).children().each(function(i, e) {
    var $e = $(e);
    if ($e.is('h2')) { // start of a new quarter's events
      helper();
      currentYear = $e.data('year');
      numOld = 0;
      isPast = false;
    }
    if ($e.is('time')) {
      isPast = false;
      var date;
      if ($e.text().indexOf(',') > 0) {
        date = Date.parse($e.text()); // date in <time> already contains the year
      } else {
        date = Date.parse($e.text() + ', ' + currentYear); // add in the year
      }
      if (date < Date.now() - DAY) {
        $e.addClass('old').hide(); // mark DATE as old
        isPast = true;
      }
    } else {
      if (isPast) {
        $e.addClass('old').hide(); // mark EVENT as old
        numOld += 1;
      }
    }
  });

  helper();

}