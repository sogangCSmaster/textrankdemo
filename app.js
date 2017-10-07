const express = require('express');
const exec = require('child_process').exec;
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.render('index', {
    keywords: []
  });
});

app.post('/', (req, res, next) => {
  const text = req.body.text;
  const filename = crypto.randomBytes(16).toString('hex');

  fs.writeFile(`/tmp/${filename}`, text, (err) => {
    if (err) {
      next(err);
    } else {
      exec(`python3 textrank/extract.py /tmp/${filename} 0.5`, (err, stdout, stderr) => {
        if (err) {
          next(err);
        } else {
          fs.unlink(`/tmp/${filename}`, (err) => {
            if (err) {
              next(err);
            } else {
              res.render('index', {
                keywords: stdout.trim().split('\n')
              });
            }
          });
        }
      });
    }
  });
});




app.listen(3000, () => {
  console.log('Server Start');
});
