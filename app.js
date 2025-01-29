const express = require('express');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
const path = require('path');
const captchaLength=6;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({size:captchaLength,
color:true,
noise:2,
background: 'FFFF00',});
  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
});

app.post('/verify', (req, res) => {
  const userCaptcha = req.body.captcha;
  const actualCaptcha = req.session.captcha;

  if (userCaptcha === actualCaptcha) {
    res.send('Captcha is correct!');
  } else {
    res.send('Captcha is incorrect!');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
