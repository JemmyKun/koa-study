var mysql = require("mysql");
var config = require("./defaultConfig");

var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
});

let allServices = {
  query: function(sql, values) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          reject(err);
        } else {
          connection.query(sql, values, (err, rows) => {
            if (err) {
              console.log("err:", err);
              reject(err);
            } else {
              resolve(rows);
            }
            connection.release();
          });
        }
      });
    });
  },
  addListItem: param => {
    let createTime = Date.now();
    let updateTime = Date.now();
    let { name } = param;
    let _sql = `INSERT INTO orderList(name,createTime,updateTime,status,pid) VALUES (?,?,?,'0',1)`;
    return allServices.query(_sql, [name, createTime, updateTime]);
  },
  deleteListItem: param => {
    let { id } = param;
    let _sql = `DELETE FROM orderList WHERE id = ${id}`;
    return allServices.query(_sql, param);
  },
  editOrderName: param => {
    let updateTime = Date.now();
    let { name, id } = param;
    let _sql = `UPDATE orderlist SET name = ?,updateTime=? WHERE id = ?`;
    return allServices.query(_sql, [name, updateTime, id]);
  },
  updateItemStatus: param => {
    let { id, status } = param;
    let newStatus = status === "0" ? "1" : "0";
    let updateTime = Date.now();
    let _sql = `UPDATE orderlist SET status = ?,updateTime=? WHERE id = ?`;
    return allServices.query(_sql, [newStatus, updateTime, id]);
  },
  getListData: param => {
    let { searchKey } = param;
    let _sql = `select * from orderList where name like '%${searchKey}%' order by createTime desc `;
    return allServices.query(_sql, [searchKey]);
  }
};

module.exports = allServices;
