// This will create a single schema definition file which the postman collection
// will read in.
// Author: Tomas Schier

// This will generate a file (or files) in the /<VERSION>/postman directory.
// One for each sector listed in the "const sectors" array
// Some manual processing is required of running this.
// This is to ensure that the Postman collection runner can consume the generated files
// In the generated output files do the following:
// 1. remove all .json and set blank
// 2. change all "$ref": "../common/<FILENAME> to "$ref": "<FILENAME>

var fs = require('fs');
var path = require('path');

const sectors = ['register'];
const version = '1.15.0';

sectors.forEach(sector => {
  const directoryPath = path.join(__dirname, version + '/schemas/' +  sector );
  const commonDirPath = path.join(__dirname, version + '/schemas/common' );
  var stream = fs.createWriteStream(__dirname + '/' +  version + '/postman/postman-validation-' + sector + '-' + version + '.json');
  var cnt = 0;
  var isFirst = true;
  var dirCnt = 0;
  var commonFile = fs.readdirSync(commonDirPath);
  var files = fs.readdirSync(directoryPath);
  commonFile.forEach(function (file) {
    var filePath = path.join(commonDirPath, file);
    if (cnt > 0) {
      stream.write(',');
    }
    cnt++;
    if (isFirst == true) {
      isFirst = false;
      stream.write('{');
    }
    var data = JSON.parse(fs.readFileSync(filePath));
    var fileName = file.substr(0, file.indexOf('.'));
    data.$id =  file;
    stream.write('"' + fileName + '" :')
    stream.write(JSON.stringify(data));
    console.log("Processed " + file);  
  });
  stream.write(',');
  cnt = 0;
  isFirst = true;
  files.forEach(function (file) {
    var filePath = path.join(directoryPath, file);
    if (cnt > 0) {
      stream.write(',');
    }
    cnt++;
          
    var data = JSON.parse(fs.readFileSync(filePath));
    var fileName = file.substr(0, file.indexOf('.'));

    data.$id =  file;   
    stream.write('"' + fileName + '" :')
    stream.write(JSON.stringify(data));
    console.log("Processed " + file);  
  
    if (cnt == files.length) {
      stream.write('}');
      stream.end();
      console.log("All done");
    } 
  });

})
