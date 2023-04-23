const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {title: 'Login'});
});

router.get('/index', (req, res) => {
  res.render('index', {title: 'Pagina inicial'});
});

router.get('/perfil', (req, res) => {
  res.render('perfil', {title: 'Perfil'});
});

router.get('/cadastro', (req, res) => {
  res.render('cadastro', {title: 'Cadastro'});
});

module.exports = router;
