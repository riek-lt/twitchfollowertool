var csvContents = [];
var accountInfo = [];
var i=0;

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

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
  	target.value = content

csvContents = content.split('\n');
for (i=0; i < csvContents.length; i++) {
  accountInfo = csvContents[i].split(',');
  console.log(accountInfo[0]);
}

  }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}
