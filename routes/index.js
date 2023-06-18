const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { readData, writeData, atualizarPerfil } = require("../auth/filestorage");
const multer = require('multer');

let users = [];

let imagePath = "";
let texto = "";
let nomeUsuario = "";

async function loadUsers() {
  try {
    users = await readData();
  } catch (err) {
    console.error("Erro ao ler dados do MongoDB:", err);
  }
}

loadUsers();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.render("login", {
    message: req.flash("error"),
    success: req.flash("success")[0],
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/index",
    failureRedirect: "/",
  })
);

router.get("/index", (req, res) => {
  if (req.isAuthenticated()) {   
    const token = process.env.SESSION_SECRET_FB;
    nomeUsuario = req.user.nome || req.user.displayName;
    res.render("index", { nomeUsuario, texto, imagePath, token });
  } else {
    res.redirect("/");
  }
});

router.get("/perfil", (req, res) => {
  if (req.isAuthenticated()) {
    nomeUsuario = req.user.nome || req.user.displayName;
    emailUsuario = req.user.email;
    dataNasc = req.user.data;
    imagemPerfil = req.user.picture || "/img/imagem_perfil.webp";
    res.render("perfil", { nomeUsuario, emailUsuario, dataNasc, imagemPerfil });
  } else {
    res.redirect("/");
  }
});

router.get("/cadastro", (req, res) => {
  res.render("cadastro", { message: req.flash("error") });
});

router.post("/cadastro", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      id: Date.now(),
      nome: req.body.nome,
      email: req.body.email,
      data: req.body.data,
      password: hashedPassword,
    };
    users.push(user);
    await writeData(users);
    res.redirect("/");

  } catch (err) {
    req.flash("error", "Ocorreu um erro ao tentar criar a conta");
    res.redirect("/cadastro");
  }
});


router.get("/logout", (req, res) => {
  const successMessage = "Você saiu da sua conta";
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect("/index");
    }
    res.render("login", { message: null, success: successMessage });
  });
});
router.get("/editarPerfil", (req, res) => {
  nomeUsuario = req.user.nome || req.user.displayName;
  emailUsuario = req.user.email;
  dataNasc = req.user.data;
  imagemPerfil = req.user.picture || "/img/imagem_perfil.webp";
  res.render("editarPerfil", { nomeUsuario, emailUsuario, dataNasc, imagemPerfil });
});

router.post("/atualizarperfil", async (req, res) => {
  if (req.isAuthenticated()) {
    const idUsuario = req.user.id;
    const nomeUsuario = req.body.nome;
    const emailUsuario = req.body.email;
    const dataNasc = req.body.data;

    await atualizarPerfil(idUsuario, emailUsuario, nomeUsuario, dataNasc);

    req.user.nome = nomeUsuario;
    req.user.email = emailUsuario;
    req.user.data = dataNasc;
    res.redirect("/perfil");
  }
});


module.exports = router;