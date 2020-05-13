var csvContents = [];
var accountInfo = [];
var i, j, b, c = 0;
var newFollowList;
var oldFollowList = "";
var difference = {};
var difference2 = {};
var previousFollowerTotal = document.getElementById('previousFollowerTotal');
var newFollowerTotal = document.getElementById('newFollowerTotal');
var leavers = document.getElementById('leavers');
var joiners = document.getElementById('joiners');
var tableDiv = document.getElementById('tableDiv');
var uploadBtn = document.getElementById('uploadBtn');
var isPartOf = false;

prepare(); //Expected output: Pear goner, cucumber newer

function prepare() {
  oldFollowList = JSON.parse(localStorage.getItem('previousList'));
  previousFollowerTotal.innerHTML = "your previous amount of followers was <b>" + oldFollowList.length + "</b>";
}


function processing() {
  newFollowerTotal.innerHTML = "your new amount of followers was <b>" + newFollowList.length + "</b>";
  uploadBtn.style.display = 'none';
  getLeavers();
  getJoiners();
  tableDiv.style.display = 'inline';
}

function getLeavers() {
  // difference =  oldFollowList.userName.filter(x => newFollowList.userName.indexOf(x) === -1);
  difference = compareJSON(oldFollowList, newFollowList);
  console.log(difference);
  console.log(difference.length);
  for (i = 0; i < difference.length; i++) {
    leavers.innerHTML += i + ": " + difference[i].userName + "<br>";
  }
}

function getJoiners() {
  difference2 = compareJSON(newFollowList, oldFollowList);
  console.log(difference);
  console.log(difference.length);
  for (i = 0; i < difference2.length; i++) {
    joiners.innerHTML += i + ": " + difference2[i].userName + "<br>";
  }
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
