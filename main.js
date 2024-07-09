var express = require('express');
const path = require('path');
const fs = require('fs');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const testdata_path = path.join(__dirname, "data");
const api_token_path = path.join(testdata_path, "api_token.json");
const api_user_path = path.join(testdata_path, "api_user.json");
const shared_folder_path = path.join(testdata_path, "shared_folder.json");
const searchstub_path = path.join(testdata_path, "searchstub");
const doc_response_file = path.join(searchstub_path, "doc-response.json");
const fax_response_file = path.join(searchstub_path, "fax-response.json");
const image_response_file = path.join(searchstub_path, "image-response.json");
const nas_path = path.join(testdata_path, "nas");
const sharedFolders_path = path.join(nas_path, "sharedfolder");
app.use(express.static('public'));


app.get('/fax_settinginfo', function (req, res) {
    res.status(200).json({destinationDir: {
        jestMockFolder: {
          file1: "file.pdf",
          file2: "image.png"
        }
    }});
});


app.post('/searchstub/nasapi', (req, res) => {
  const searchInput = req.body;
  const json = JSON.parse(fs.readFileSync(doc_response_file)); 
  res.status(200).json(json)
});

app.post('/searchstub/faxapi', (req, res) => {
  const searchInput = req.body;
  const json = JSON.parse(fs.readFileSync(fax_response_file)); 
  res.status(200).json(json)
});



  // Define a route to serve shared folder information based on user
  app.get('/shared_folder_info/permission/:user', (req, res) => {
    const user = req.params.user;
    const sharedFolders = JSON.parse(fs.readFileSync(shared_folder_path));
    if (sharedFolders.hasOwnProperty(user)) {
      res.status(200).json(sharedFolders[user]);
    }
    else{
      res.status(400).json("404 file not found");
    }
  });


  app.post('/api/v0/token', (req, res) => {
    
    const { code, nas_id } = req.body;
    
    const data = JSON.parse(fs.readFileSync(api_token_path));
    const dataElement = data.find(entry => entry.code == code && entry.nas_id == nas_id);

    if (dataElement) {
        res.status(200).json(dataElement.resBody);
    }
    else {
        res.status(404).json({ error: 'Token not found' });
    }
});

app.get('/api/v0/users', (req, res) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const data = JSON.parse(fs.readFileSync(api_user_path));
    const dataElement = data.find(entry => entry.token == token);
    if (dataElement) {
        res.status(200).json(dataElement.resBody);
    }
    else {
        res.status(404).json({ error: 'Token not found' });
    }
});


app.get('/shared_folder_info/user/:user', (req, res) => {
  const user = req. url.split('/')[3];
  const sharedFolders = JSON.parse(fs.readFileSync(shared_folder_path));
  if (sharedFolders.hasOwnProperty(user)) {
    res.status(200).json({"user" : user});
  }
  else{
    res.status(400).json("User not found");
  }
});

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});