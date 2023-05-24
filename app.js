const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();
const apikey = process.env.API_KEY;
const { request } = require("http");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/sign-up.html`);
});

// mailchimp setup

app.post("/", (req, res) => {
  const { fname, lname, email } = req.body;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };
  const url = "https://us21.api.mailchimp.com/3.0/lists/47f9421662";
  const options = {
    method: "POST",
    auth: `Xnd:${apikey}`,
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
    console.log(response.statusCode);
  });

  const jsonData = JSON.stringify(data);
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on 3k");
});
