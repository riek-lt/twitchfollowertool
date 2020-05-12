var csvContents = [];
var accountInfo = [];
var i, j = 0;
var jsonList;
var previousList = "";
var previousFollowerTotal = document.getElementById('previousFollowerTotal');

main();



function main() {
  previousList = JSON.parse(localStorage.getItem('previousList'));
previousFollowerTotal.innerHTML = "your previous amount of followers was <b>" + previousList.length + "</b>";
}

function placeFileContent(target, file) {
  readFileContent(file).then(content => {
    target.value = content;

    jsonList = csvJSON(content);
    localStorage.setItem('previousList', jsonList.toString());
    jsonList = JSON.parse(jsonList);


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
