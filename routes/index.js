const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { readData, writeData } = require('../auth/filestorage');

let users = [];

async function loadUsers() {
  try {
    users = await readData();
  } catch (err) {
    console.error("Erro ao ler dados do MongoDB:", err);
  }
}

loadUsers();

router.get('/', (req, res) => {
  res.render('login',{ message: req.flash('error'), success: req.flash('success')[0] });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/',
    failureFlash: true,
  })
);

router.get('/index', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('index');
    } else {
      res.redirect('/');
    }
});

router.get('/perfil', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('perfil');
  } else {
    res.redirect('/');
  }
});

router.get('/cadastro', (req, res) => {
  res.render('cadastro', { message: req.flash('error') });
});

router.post('/cadastro', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      id: Date.now(),
      nome: req.body.nome,
      email: req.body.email,
      data: req.body.data,
      password: hashedPassword
    };
    users.push(user);
    await writeData(users);
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'Ocorreu um erro ao tentar criar a conta');
    res.redirect('/cadastro');
  }
});

router.get('/logout', (req, res) => {
  const successMessage = 'Você saiu da sua conta';
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.redirect('/index');
    }
    res.render('login', { message: null, success: successMessage });
  });
});

module.exports = router;

