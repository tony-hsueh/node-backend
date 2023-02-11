require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const db = require('./database/db-setting');
const bcrypt = require('bcrypt');

const app = express();

const corsOptions = {
  origin: [
    'http://www.example.com',
    'http://localhost:3000',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser())

function authMiddleware(req, res, next) {
  // get token and check if it's exist

  // verify token

  // check if user still exists

  // check if user changed password after the token was issued
}

app.get('/', (req, res) => {
  res.send('fukc you')
})

app.get ('/member/:id', async (req, res) => {
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
    const {account, password, name} = req.body
    // 密碼加密
    const hash = await bcrypt.hash(password, 10);  
    const [results, fields] = await db.query(sql, [
      account,
      hash,
      name,
    ])

    output.success = true;
    output.data = results;
  }
  catch (err) {
    console.log(err)
  }
  res.json(output);
})

app.post('/login', async (req, res) => {
  const output = {
    success: false,
    error: '',
    data: []
  }
  const {account, password} = req.body;
  const sql = "SELECT * FROM `members` WHERE `account` = ?"

  try {
    const [results] = await db.query(sql, [account]);
    const {id, name, password: hash} = results[0]
    if (results.length === 0) {
      output.error = '帳號或密碼錯誤'
      return res.status(401).json(output);
    } 
    // 檢查密碼
    const checkSamePwd = await bcrypt.compare(password, hash);

    if (!checkSamePwd) {
      output.error = '帳號或密碼錯誤'
      return res.status(401).json(output);
    }

    const token = jwt.sign({name, id}, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

    output.success = true;
    res
      .status(201)
      .cookie('authToken', token, {httpOnly: true,expires: new Date(Date.now() + 8 * 3600000)})
      .json(output)
  }
  catch (err) {
    console.log('errorrrr',err)
  }
})

app.post('/', (req, res) => {
  res.send('you can post fukc you')
})

app.get('/member', (req, res) => {
  console.log('aa',req.cookies?.authToken)
  res.send('yoyo')
})

const port = 4000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
})