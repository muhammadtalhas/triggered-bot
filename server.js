/**
 * Created by Talha on 6/15/2017.
 */
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var alex = require("alex")
var HTTPS = require('https');

var token = "NZfziq1UFdkoQ1GdbDHdwAq6xz4tbXZsPrpmyFlr"
var bot = "67644e0783121a3cc77f0f4d00"
var group = "14043850"


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});


router.route('/new')

    .post(function (req, res) {
        console.log("GROUPME SAID HI")
        //console.log(req)
        if (req.body.user_id != "398780") {

            msg = req.body.text;
            vfile = alex.text(msg)

            if (vfile.messages) {
                console.log(vfile.messages[0].message)
                var payload = "{\"bot_id\"  : \"NZfziq1UFdkoQ1GdbDHdwAq6xz4tbXZsPrpmyFlr\",\"text\"    :" + vfile.messages[0] + "}"

                options = {
                    hostname: 'api.groupme.com',
                    path: '/v3/bots/post',
                    method: 'POST'
                };

                body = {
                    "bot_id": bot,
                    "text": vfile.messages[0].message
                };

                botReq = HTTPS.request(options, function (res) {
                    console.log(res.statusCode)
                    if (res.statusCode == 202) {
                        //neat
                    } else {
                        console.log('rejecting bad status code ' + res.statusCode);
                    }
                });

                botReq.on('error', function (err) {
                    console.log('error posting message ' + JSON.stringify(err));
                });
                botReq.on('timeout', function (err) {
                    console.log('timeout posting message ' + JSON.stringify(err));
                });
                botReq.end(JSON.stringify(body));

            }

        }
    })
;

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);