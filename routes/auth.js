var express = require('express')
var request = require('request')
var router = express()
var noAuth = require('../middlewares/noAuth')
var isAuth = require('../middlewares/isAuth')
var apiURL = require('../config/api').url

router.get('/', noAuth, function (req, res, next) {
  res.render('auth/index', { title: 'Ingresar' })
})

router.post('/signup', noAuth, (req, res) => {
  if (req.body.isArtist === '1') req.body.isArtist = true
  else req.body.isArtist = false
  request.post(apiURL + '/user', {json: req.body}, (error, response, body) => {
    if (error) return res.status(500).send(error)
    // Aca deberia meterse una vista y enviar como data el response.body (Estilo openfuture)
    if (response.statusCode !== 200) return res.send(response.body)
    req.session.user_id = response.body._id
    res.redirect('/perfil')
  })
})

router.post('/signin', noAuth, (req, res) => {
  request.post(apiURL + '/auth', {json: req.body}, (error, response, body) => {
    if (error) return res.send(error)
    // Aca deberia meterse una vista y enviar como data el response.body (Estilo openfuture)
    if (response.statusCode !== 200) return res.send(response.body)
    req.session.user_id = response.body._id
    res.redirect('/perfil')
  })
})

router.post('/logout', isAuth, (req, res) => {
  req.session = null
  res.redirect('/')
})

module.exports = router
