var express = require('express');
var router = express.Router();
var User = require('../models/user')
var jwt = require('jsonwebtoken');
const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';
const refreshTokens = [];
const {
  aesDecrypt, aesEncrypt, rsaEncryptWithPubKey, rsaEncryptWithPrivateKey, rsaDecryptWithPrivateKey, rsaDecryptWithPublicKey
} = require('../js/enc_dec');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Iframe' });
});

// register
router.post('/register', (req, res) => {
  console.log('req: ', req.body)
  var user = new User(req.body)
  user.save((err, result) => {
    if (err) throw err
    if (result) {
      const accessToken = jwt.sign({ email: result.email, password: result.password }, accessTokenSecret, { expiresIn: '20m' });
      const refreshToken = jwt.sign({ email: result.email, password: result.password }, refreshTokenSecret);
      refreshTokens.push(refreshToken);
      console.log('access token: ', accessToken)
      // encrypt access token with AES
      var aesAccessTokenEncrypt = aesEncrypt(accessToken)
      console.log('access token after aes encrypting: ', aesAccessTokenEncrypt)

      // // encrypt aes access token with RSA
      // var rsaAccessTokenEncrypt = rsaEncryptWithPubKey(aesAccessTokenEncrypt, './bin/public.pem')
      // console.log('access token after rsa encrypting: ', rsaAccessTokenEncrypt)



      res.send({ accessToken: aesAccessTokenEncrypt, user: result, url: 'http://localhost:3000/home' })
    } else {
      res.send({ message: 'Failed to register!', url: 'http://localhost:3000/' })

    }

  })
})

// login
router.post('/login', (req, res) => {
  console.log('req', req.body)
  User.findOne({ email: req.body.email, password: req.body.password }).select('name _id email').exec((err, result) => {
    if (err) throw err
    console.log('result of login: ', result)
    if (result) {
      const accessToken = jwt.sign({ email: result.email, password: result.password }, accessTokenSecret, { expiresIn: '20m' });
      const refreshToken = jwt.sign({ email: result.email, password: result.password }, refreshTokenSecret);
      refreshTokens.push(refreshToken);
      console.log('access token: ', accessToken)

      // encrypt access token with AES
      var aesAccessTokenEncrypt = aesEncrypt(accessToken)
      console.log('access token after aes encrypting: ', aesAccessTokenEncrypt)

      // // encrypt aes access token with RSA
      // var rsaAccessTokenEncrypt = rsaEncryptWithPubKey(aesAccessTokenEncrypt, './bin/public.pem')
      // console.log('access token after rsa encrypting: ', rsaAccessTokenEncrypt)



      res.send({ accessToken: aesAccessTokenEncrypt, user: result, url: 'http://localhost:3000/home' })
    } else {
      res.send({ message: 'Email or password is invalid!', url: 'http://localhost:3000/' })
    }
  })

})

// get me
router.get('/me/:id', (req, res) => {
  console.log('req params: ', req.params.id)
  try {
    // var accessToken = req.query.token
    // console.log('access token: ', accessToken)

    // // decrypt rsa access token with RSA
    // var rsaAccessTokenDecrypt = rsaDecryptWithPrivateKey(accessToken, './bin/private.pem')
    // console.log('access token after rsa decrypt: ', rsaAccessTokenDecrypt)

    // // decrypt access token with AES
    // var aesAccessTokenDecrypt = aesDecrypt(rsaAccessTokenDecrypt)
    // console.log('access token after aes decrypt: ', aesAccessTokenDecrypt)
    User.findOne({ _id: req.params.id }).select('name email _id').exec((err, result) => {
      if (err) throw err
      const accessToken = jwt.sign({ email: result.email, password: result.password }, accessTokenSecret, { expiresIn: '20m' });
      const refreshToken = jwt.sign({ email: result.email, password: result.password }, refreshTokenSecret);
      refreshTokens.push(refreshToken);

      res.send({ accessToken, refreshToken, result })
    })
  } catch (err) {
    console.error(err)
  }

})

module.exports = router;
