const mysql = require('mysql');

const conn = mysql.createConnection({
  host: '127.0.0.1', //数据库地址
  user: 'root',
  password: 'root',
  database: 'myshopdb'
})

conn.connect();


module.exports = conn