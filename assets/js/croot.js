var TWITCH_CLIENT_ID = '8s3qw0n4yacm066p8d7d4nm94mah3s';
var localUser = {};
var followerList = [];
var filteredResultCounterMax = 25000;
var topDaysCount = 10;

function escapeHtml(string) {
  let entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  return String(string).replace(/[&<>"'\/]/g, function(s) {
    return entityMap[s];
  });
}


function getUserForUsername(username) {
  $('#status').html('<div class="alert alert-info" role="alert">Loading channel information ...</div>');

  $.ajax({
    url: 'https://api.twitch.tv/kraken/users?login=' + username.trim().toLowerCase(),
    type: 'GET',
    timeout: 30000,
    cache: false,
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_CLIENT_ID,
    },
    success: function(result, textStatus, jqXHR) {
      if (typeof result['_total'] !== 'undefined' && result['_total'] == '1') {
        localUser = result['users'][0];
        $(document).attr('title', $(document).attr('title') + ' - ' + result['users'][0]['name']);
        $('#status').html('<div class="alert alert-info" role="alert">Loading followers ...</div>');
        $('#content').html('');
        getFollowersFromAPI('');
      } else {
        $('#status').html('<div class="alert alert-warning" role="alert">No channel with this name was found!</div>');
        $('#lookup-user-button').removeAttr('disabled');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      let err = jqXHR.status + ', ' + textStatus + ', ' + errorThrown;
      $('#status').html('<div class="alert alert-warning" role="alert">Error while getting channel info, please try again. (' + escapeHtml(err) + ')</div>');
      $('#lookup-user-button').removeAttr('disabled');
    },
  });
}

function getFollowersFromAPI(cursor) {
  var cursor = typeof cursor !== 'undefined' ? cursor : '';

  // Make sure the local followerList is empty when we start a new scan
  if (cursor === '') {
    followerList = [];
  }

  $.ajax({
    url: 'https://api.twitch.tv/kraken/channels/' + localUser['_id'] + '/follows?limit=100&direction=desc&cursor=' + cursor,
    type: 'GET',
    timeout: 30000,
    cache: false,
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_CLIENT_ID,
    },
    success: function(result, textStatus, jqXHR) {
      if (typeof result['_total'] !== 'undefined') {
        // Add followers to local cache
        $(result['follows']).each(function(i, e) {
          let follow = {
            followCreatedAt: Date.parse(e.created_at),
            accCreatedAt: Date.parse(e.user.created_at),
            userName: e.user.name,
            userID: e.user['_id'],
          };
          followerList.push(follow);
        });

        // Display current status
        $('#status').html('<div class="alert alert-info" role="alert">Loading followers ... ' + escapeHtml(new Intl.NumberFormat().format(followerList.length)) + ' / ' + escapeHtml(new Intl.NumberFormat().format(result['_total'])) + '</div>');

        if (typeof result['_cursor'] !== 'undefined' && result['_cursor'].length > 0) {
          getFollowersFromAPI(result['_cursor']);
        } else {
          $('#status').html('<div class="alert alert-success" role="alert">Loading of ' + escapeHtml(new Intl.NumberFormat().format(followerList.length)) + ' followers done!</div>');

          console.log(JSON.stringify(followerList));
          localStorage.setItem('previousList', JSON.stringify(followerList));
          newFollowList = followerList;
          processing();

          $('#status').empty();
        }
      } else {
        $('#status').html('<div class="alert alert-warning" role="alert">Error while getting followers, please try again. (' + JSON.stringify(result) + ')</div>');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      let err = jqXHR.status + ', ' + textStatus + ', ' + errorThrown;
      $('#status').html('<div class="alert alert-warning" role="alert">Error while getting followers, please try again. (' + escapeHtml(err) + ')</div>');
    },
  });
}
