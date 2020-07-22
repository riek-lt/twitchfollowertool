var csvContents = [];
var accountInfo = [];
var i, j, b, c, k = 0;
var newFollowList;
var oldFollowList = "";
var difLeavers, difLeaverList = [];
var difJoiners, difJoinerList = [];
var isNameChanger = false;
var previousFollowerTotal = document.getElementById('previousFollowerTotal');
var newFollowerTotal = document.getElementById('newFollowerTotal');
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

getUserForUsername("riekelt");

// prepare(); //Expected output: Pear goner, cucumber newer

function prepare() {
  oldFollowList = JSON.parse(localStorage.getItem('previousList'));
  if (oldFollowList != null) {
    previousFollowerTotal.innerHTML = "your previous amount of followers was <b>" + oldFollowList.length + "</b>";
  } else {
    firstTime = true;
  }
}

function processing() {
  newFollowerTotal.innerHTML = "your new amount of followers was <b>" + newFollowList.length + "</b>";
  uploadBtn.style.display = 'none';
  if (firstTime) {
    newtimer.style.display = 'inline';
  }
  getNames();
  findNameChangers();
  getLeavers();
  getJoiners();
  tableDiv.style.display = 'inline';
}

function getNames() {
  difLeavers = compareJSON(oldFollowList, newFollowList);
  difJoiners = compareJSON(newFollowList, oldFollowList);
}

function getLeavers() {
  k=0;
  for (i = 0; i < difLeavers.length; i++) {
    if (!inArray(difLeavers[i].userName, difLeaverList)) {
      k++;
      row = leavers.insertRow(-1);
      cell = row.insertCell(0);
      cell.innerHTML = k + ": " + difLeavers[i].userName;
    }
  }
    unfollowNumber.innerHTML = k;
}

function getJoiners() {
  k=0;
  for (i = 0; i < difJoiners.length; i++) {
    if (!inArray(difJoiners[i].userName, difJoinerList)) {
      k++;
      row = joiners.insertRow(-1);
      cell = row.insertCell(0);
      cell.innerHTML = k + ": " + difJoiners[i].userName;
    }
  }
    followNumber.innerHTML = k;
}

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

function inArray(needle, haystack) {
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] === needle) {
      return true;
    }
  }
  return false;
}

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

function placeFileContent(target, file) {
  readFileContent(file).then(content => {
    target.value = content;
    newFollowList = csvJSON(content);
    localStorage.setItem('previousList', newFollowList.toString());
    newFollowList = JSON.parse(newFollowList);
    processing();
  }).catch(error => console.log(error))
}
//Don't actually do stuff beneath this line

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
