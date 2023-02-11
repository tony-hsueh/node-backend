const mysql = require('mysql2');

const pool = mysql.createPool({
  host:process.env.DB_HOST || 'localhost',
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  waitForConnections:true,
  connectionLimit:5, //最大連線數
  queueLimit:0, //排隊限制
  dateStrings:true,
});

module.exports = pool.promise();