const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// const { resourceLimits } = require("worker_threads");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));  // use to  display images and loads static css


app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
}) ;

app.post("/", function (request, response) {

    // console.log(request.body);
    const fname = request.body.Fname;
    const lname = request.body.Lname;
    const email = request.body.Email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);   // because we need to send the data in compact form

    const url = "https://us20.api.mailchimp.com/3.0/lists/{ListId}";

    const options = {
        method: "POST",
        auth: "k_ayush:API_KEY"
    }

    const req = https.request(url, options, function (res) {

        if (res.statusCode === 200)
            response.sendFile(__dirname + "/success.html");

        else
            response.sendFile(__dirname + "/failure.html");

        res.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    req.write(jsonData);
    req.end();
});

app.post("/failure.html" , function(request,response){
    response.redirect("/") ;
})


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});


