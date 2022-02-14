import express, { Request, Response, NextFunction } from "express";
import { app_types } from "global";
import path from "path";
import { updateViewCount } from "./db";

/*
Common JS
*/
const nocache = require("nocache");
var useragent = require("express-useragent");

/*
Middle Ware
*/

const app = express();
app.set("view engine", "ejs"); // 1
app.use(express.static(__dirname + "/views"));
app.use(nocache());
app.use(useragent.express());

/*
Routes
*/

interface ReqWithUserAgent extends Request {
  useragent: {
    [key: string]: any;
  };
}

app.get(
  "/cp/youtube.com/:productId/:optionId/file.png",
  (req: Request, res: Response) => {
    // <iframe src='http://localhost:1234/cp/youtube.com/1234/5678/file.png' style="display:none;visibility:hidden" ></iframe>

    const withAgentReq = req as ReqWithUserAgent;

    const { productId, optionId } = req.params;
    const { isMobile } = withAgentReq.useragent;
    const os = isMobile ? "MOBILE" : "DESKTOP";

    const reqInfo: app_types.AccessLog = {
      productId,
      optionId,
      os,
    };

    console.log(`
    [쿠팡 상품 접근 로그 발생]
    상품 ID : ${productId}
    ${optionId && `옵션 ID : ${optionId}`}
    접속 OS : ${os}
    \n`);

    updateViewCount(reqInfo);

    res.render("coupang", { productId, optionId });
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${port}🛡️
  ################################################
`);
});
