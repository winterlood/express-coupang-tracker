import { app_types } from "global";
import mysql from "mysql";

require("dotenv").config();

console.log(`ENV CHECK`);
console.log({
  host: process.env.CUPANG_TRACKER_MYSQL_HOST,
  user: process.env.CUPANG_TRACKER_MYSQL_USER,
  password: process.env.CUPANG_TRACKER_MYSQL_PASSWORD,
  database: process.env.CUPANG_TRACKER_MYSQL_DATABASE,
});
console.log(`\n`);

const connection = mysql.createConnection({
  host: process.env.CUPANG_TRACKER_MYSQL_HOST,
  user: process.env.CUPANG_TRACKER_MYSQL_USER,
  password: process.env.CUPANG_TRACKER_MYSQL_PASSWORD,
  database: process.env.CUPANG_TRACKER_MYSQL_DATABASE,
  // host: "34.64.92.51",
  // user: "da",
  // password: "ekalswjdrn",
  // database: "cupang_tracker",
});
connection.connect();

const table = "access_info";

const query = (qs: string, cb?: (err: any, res: any, fileds: any) => void) => {
  connection.query(qs, cb);
};

export const updateViewCount = (accessLog: app_types.AccessLog) => {
  const updateColumn =
    accessLog.os === "MOBILE" ? "mobile_view_count" : "desktop_view_count";

  const { productId, os } = accessLog;
  const qs = `
    select * from ${table} where productId=${productId}
    `;

  query(qs, (err, res, fileds) => {
    if (res.length > 0) {
      const curQs = `
       update ${table} 
       set ${updateColumn}=${table}.${updateColumn} + 1 
       where productId=${accessLog.productId}`;

      query(curQs, () => {
        // console.log("update");
      });
    } else {
      const curQs = `
      insert into ${table}(productId, ${
        os === "MOBILE" ? "mobile_view_count" : "desktop_view_count"
      }) 
      values(${productId},1)
      `;

      query(curQs, () => {
        // console.log("create");
      });
    }
  });
};
