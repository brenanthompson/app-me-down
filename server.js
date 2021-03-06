var express = require("express");
var app = express();
var path = require("path");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var config = require("./config");
var expressJwt = require("express-jwt");
var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");

var port = process.env.PORT || 5000;

app.use(morgan("dev"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", expressJwt({secret: config.secret}).unless({path: [{url: '/api/items', methods: ["GET"]}]}));
app.use("/api/items", require("./routes/item-routes"));
app.use("/api/users", require("./routes/user-routes"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

mongoose.connect(config.database);


app.use("/auth/change-password", expressJwt({secret: config.secret}));

app.use("/auth", require("./routes/auth-routes"));

app.use("/api/send-email", require("./routes/email-routes"));

app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});



