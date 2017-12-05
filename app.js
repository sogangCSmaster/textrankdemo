const express = require('express');
const exec = require('child_process').exec;
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser');
const Promise = require('bluebird');

const app = express();

const execAsync = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};

app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.render('index', {
    keywords: [],
    sentences: [],
  });
});

app.post('/', (req, res, next) => {
  const text = req.body.text;
  const filename = crypto.randomBytes(16).toString('hex');

  fs.writeFile(`/tmp/${filename}`, text, (err) => {
    if (err) {
      next(err);
    } else {
      Promise.all([
        execAsync(`python3 textrank/extract.py /tmp/${filename} 0.1`),
      ])
        .spread((keyword) => {
          fs.unlink(`/tmp/${filename}`, (err) => {
            if (err) {
              next(err);
            } else {
              res.render('index', {
                keywords: keyword.trim().split('\n')
              });
            }
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});




app.listen(3000, () => {
  console.log('Server Start, Port:3000');
});
