const express = require('express');
const path = require ('path')
const app = express();
const routes = require('./routes');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const { readData, writeData } = require('./auth/filestorage');
const users = readData();

passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      const user = users.find((user) => user.email === email);
      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado' });
      }
  
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Senha incorreta' });
        }
      });
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    const user = users.find((user) => user.id === id);
    done(null, user);
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
  });

app.use('/', routes);

module.exports = app;