import express, { Request, Response, NextFunction } from "express";
import path from "path";

/*
Common JS
*/
const nocache = require("nocache");
var useragent = require("express-useragent");

/*
Middle Ware
*/

interface RequestWithAgent extends Request {
  useragent: any;
}

const app = express();
app.set("view engine", "ejs"); // 1
app.use(express.static(__dirname + "/views"));
app.use(nocache());
app.use(useragent.express());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.header("origin"));
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use((req, res, next) => {
  console.log("request!");
  const reqWithAgent = req as RequestWithAgent;
  const host = reqWithAgent.get("host");
  const origin = reqWithAgent.get("origin");
  let fullUrl =
    reqWithAgent.protocol +
    "://" +
    reqWithAgent.get("host") +
    reqWithAgent.originalUrl;

  console.log({ host, origin, fullUrl });
  next();
});

/*
Routes
*/

app.get("/cp/youtube.com/:productId/:optionId/file.png", (req, res) => {
  // <iframe src='http://localhost:1234/cp/youtube.com/1234/5678/file.png' style="display:none;visibility:hidden" ></iframe>
  const { productId, optionId } = req.query;
  console.log("IFRAME REQUEST!");
  console.log(req.query);
  res.render("coupang", { productId, optionId });
});

app.get(
  "/file/:productId/:optionId/file.png",
  (req: Request, res: Response) => {
    // <img src='http://localhost:1234/file/6320457040/80547016275/file.png' />
    const reqWithAgent = req as RequestWithAgent;
    console.log(req.query);
    res.sendFile(path.join(__dirname, "../public", "file.png"));
  }
);

app.get("/file/:productId/file.png", (req: Request, res: Response) => {
  // <img src='http://localhost:1234/file/6320457040/file.png' />
  const reqWithAgent = req as RequestWithAgent;
  console.log(req.query);
  res.sendFile(path.join(__dirname, "../public", "file.png"));
});

app.listen("1234", () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 1234🛡️
  ################################################
`);
});