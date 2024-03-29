var csvContents = [];
var accountInfo = [];
var i, j, b, c, k = 0;
var newFollowList;
var oldFollowList = "";
var ownUsername = "";
var difLeavers, difLeaverList = [];
var difJoiners, difJoinerList = [];
var isNameChanger = false;
var previousFollowerTotal = document.getElementById('previousFollowerTotal');
var savedUsername = document.getElementById('savedUsername');
var newFollowerTotal = document.getElementById('newFollowerTotal');
var twitchNameInsert = document.querySelector('#twitchNameInsert');
var useTwitch = document.querySelector('#useTwitch');
var leavers = document.querySelector('#leavers');
var joiners = document.querySelector('#joiners');
var tableDiv = document.getElementById('tableDiv');
var uploadBtn = document.getElementById('uploadBtn');
var newtimer = document.getElementById('newtimer');
var unfollowNumber = document.getElementById('unfollowNumber');
var followNumber = document.getElementById('followNumber');
var nameChangers = document.querySelector('#namechangers');
var isPartOf, firstTime = false;
var row;
var cell, cell2;

prepare();

function prepare() {
  //Loads previous save data
  // console.log(localStorage.getItem('previousList'));
  oldFollowList = JSON.parse(localStorage.getItem('previousList'));
  if (oldFollowList != null) {
    previousFollowerTotal.innerHTML = "your previous amount of followers was <b>" + oldFollowList.length + "</b>";
  } else {
    //enable firstTime if there is no prior savedata stored.
    firstTime = true;
  }
  //Loads previous username, if any is set
  ownUsername = localStorage.getItem('userName');
  if (ownUsername != null) {
    savedUsername.innerHTML = "your current username is set to <b>" + ownUsername + "</b>. You can remove your name by <a href='javascript:removeSavedUsername()'>clicking here.</a> (Refreshes the page)";
    twitchNameInsert.style.display = "none";
  } else {
    useTwitch.style.display = "none";
  }
}

function useTwitchImport() {
  //Useless function, thought there'd be more stuff here. Will point it directly to getUserForUsername() later.
  getUserForUsername(ownUsername);
}

//This will process the differences in the list.
function processing() {
  newFollowerTotal.innerHTML = "your new amount of followers was <b>" + newFollowList.length + "</b>";
  uploadBtn.style.display = 'none';
  // useTwitch.style.display = 'none';
  if (firstTime) {
    //Displays the first-time message
    newtimer.style.display = 'inline';
  }
  populateDifs(); //Function to populate the lists with accounts that unfollowed and followed ahead of time.
  findNameChangers();
  getLeavers();
  getJoiners();
  tableDiv.style.display = 'inline'; //Makes the filled-in table show up in 1 go.
}

function populateDifs() {
  difLeavers = compareJSON(oldFollowList, newFollowList);
  difJoiners = compareJSON(newFollowList, oldFollowList);
}

//This function throws all the unfollowers in a list. Accounts that did a namechange
//are removed with inArray since people who change name are seen as unfollowers.
function getLeavers() {
  k = 0;
  for (i = 0; i < difLeavers.length; i++) {
    if (!inArray(difLeavers[i].userName, difLeaverList)) {
      k++;
      row = leavers.insertRow(-1);
      cell = row.insertCell(0);
      cell.innerHTML = k + ': <a href="http://twitch.tv/' + difLeavers[i].userName + '" target="_blank">' + difLeavers[i].userName + '</a>';
    }
  }
  unfollowNumber.innerHTML = k;
}

//Similar to getLeavers()
function getJoiners() {
  k = 0;
  for (i = 0; i < difJoiners.length; i++) {
    if (!inArray(difJoiners[i].userName, difJoinerList)) {
      k++;
      row = joiners.insertRow(-1);
      cell = row.insertCell(0);
      cell.innerHTML = k + ': <a href="http://twitch.tv/' + difJoiners[i].userName + '" target="_blank">' + difJoiners[i].userName + '</a>';
    }
  }
  followNumber.innerHTML = k;
}

//Show people who changed their name by comparing userID's from followers and unfollowers.
//This was made since it showed a lot of false positives, and thus made this extra fun table.
function findNameChangers() {
  isNameChanger = false;
  for (var i = 0; i < difLeavers.length; i++) {
    for (var j = 0; j < difJoiners.length; j++) {
      if (difLeavers[i].userID == difJoiners[j].userID) {
        k++;
        nameChangers.style.display = 'inline';
        row = nameChangers.insertRow(k + 1);
        cell = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell.innerHTML = difLeavers[i].userName;
        cell2.innerHTML = difJoiners[j].userName;
        difLeaverList.push(difLeavers[i].userName);
        difJoinerList.push(difJoiners[j].userName);
      }
    }
  }
}

//Used to check if any unfollowers changed their name.
function inArray(needle, haystack) {
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] === needle) {
      return true;
    }
  }
  return false;
}

//This function checks if the username of 1 is in the other. If it is NOT,
//it returns it to a separate obj array.
var compareJSON = function(obj1, obj2) {
  var res = [];
  b = 0;
  // return obj1.filter((i => a => a.userName !== obj2[i].userName || !++i)(0));
  for (var i = 0; i < obj1.length; i++) {
    isPartOf = false;
    for (var j = 0; j < obj2.length; j++) {
      if (obj1[i].userName == obj2[j].userName) {
        isPartOf = true;
        continue;
      } else {
        c = i;
      }
    }
    if (!isPartOf) {
      res[b] = obj1[c]
      b++;
    }
  }
  return res;
}

function insertUsername() {
  var nameInput = document.getElementById('nameForm').elements.item(0).value;
  localStorage.setItem('userName', nameInput);
  location.reload;
}

function removeSavedUsername() {
  location.reload;
  localStorage.removeItem('userName');
  window.location.reload(true);
  return false;
}

function placeFileContent(target, file) {
  readFileContent(file).then(content => {
    target.value = content;
    newFollowList = csvJSON(content);
    localStorage.setItem('previousList', newFollowList.toString());
    newFollowList = JSON.parse(newFollowList);
    processing();
  }).catch(error => console.log(error))
}

//Don't actually do stuff beneath this line, breaks upload logic.
//-----------------------------------------------------------------
function readFileContent(file) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

document.getElementById('input-file')
  .addEventListener('change', getFile)

function getFile(event) {
  const input = event.target
  if ('files' in input && input.files.length > 0) {
    placeFileContent(
      document.getElementById('content-target'),
      input.files[0])
  }
}

//Somehow grabs a CSV and turns it into a json
function csvJSON(csv) {
  let lines = csv.split("\n");
  let result = [];
  let headers = lines[0].split(",");
  for (i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}
