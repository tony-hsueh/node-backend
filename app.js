require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = require('./database/db-setting');

const app = express();

const corsOptions = {
  origin: [
    'http://www.example.com',
    'http://localhost:3000',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

function authMiddleware(req, res, next) {
  // get token and check if it's exist

  // verify token

  // check if user still exists

  // check if user changed password after the token was issued
}

app.get('/', (req, res) => {
  res.send('fukc you')
})

app.get ('/:id', async (req, res) => {
  const output = {
    success: false,
    error: '沒有這名會員',
    data: [],
  }
  const { id } = req.params;
  const sql = 'SELECT * FROM `members` WHERE `id` = ?'
  try {
    const [results, fields] = await db.query(sql, [id]);
    if (results.length === 0) return res.json(output)
    output.success = true
    output.error = ''
    output.data = results
    console.log(fields)
  }
  catch (err) {
    console.log(err)
  }
  res.json(output)
})

app.post("/register", async (req, res) => {
  const output = {
    success: false,
    error: '',
    data: [],
  }
  const sql = 'INSERT INTO `members`(`account`, `password`, `name`) VALUES (?, ?, ?)';
  try {
    console.log(req.body)
    const [results, fields] = await db.query(sql, [
      req.body.account,
      req.body.password,
      req.body.name,
    ])

    output.success = true;
    output.data = results;
  }
  catch (err) {
    console.log(err)
  }
  res.json(output);
})

app.post('/login', (req, res) => {
  console.log(req.body);
  const userName = req.body.name;
  const token = jwt.sign({name: userName}, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' })
  res.status(201).json({
    status: 'success',
    token,
    data: {
      name: 'uerName'
    }
  })
})

app.post('/', (req, res) => {
  res.send('you can post fukc you')
})

const port = 4000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
})