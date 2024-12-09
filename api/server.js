const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = 5000;
const SECRET_KEY = "asoindasubd12391290___^^^^~~~~"; 

app.use(cors());
app.use(bodyParser.json());

const users = [];

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  // Verifica se o usuário já existe
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Usuário já cadastrado." });
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Adiciona o usuário ao "banco"
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);
  console.log(newUser);

  return res.status(201).json({ message: "Usuário cadastrado com sucesso." });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);

  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  // Busca o usuário
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  // Verifica a senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Senha inválida." });
  }

  // Gera um token JWT
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1m",
  });

  return res.status(200).json({ token });
});

app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Busque o usuário no "banco de dados" com base no ID decodificado
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Retorne as informações do usuário
    return res.status(200).json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
