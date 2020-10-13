var express = require('express');
var router = express.Router();
var fetch = require('fetch')
var {
  aesDecrypt, aesEncrypt, rsaEncryptWithPubKey, rsaEncryptWithPrivateKey, rsaDecryptWithPrivateKey, rsaDecryptWithPublicKey
} = require('../js/enc_dec');

// get login page
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Parent' });
});

// home page 
router.get('/home', function (req, res) {
  res.render('home', {})
})

router.get('/game', function (req, res) {
  res.render('game', { game: 'Game 1' })
})

router.get('/me/:id', function (req, res) {
  console.log('id: ', req.params.id)
  console.log('req query: ', req.query)
  fetch.fetchUrl(`http://localhost:3001/me/${req.params.id}`, function (err, meta, result) {
    console.log('meta in index game platform: ', meta)
    var result = result ? JSON.parse(result.toString('utf-8')) : null
    console.log('result in index game platform: ', result)

    res.render('me', { result: result.result })

  })
})

module.exports = router;
