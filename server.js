var express = require('express');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const Nexmo = require('nexmo');
var url = "mongodb://127.0.0.1:27017";



var app = express();
app.set('port', 4000);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let accountConfig = {
    "account0": {
        "publicAddress": "0xB92a043a52739a3feD42b95F82ED43C44bFE227F",
        "privateKey": "1bf0a419914ef821de9cc51c9fe325d3acedf025d676ccecbf0a5f84c200d66a",
        "engaged": 0
 
    },
 
    "account1": {
         "publicAddress": "0xDD3c2161015e68519451E9153C663fB8909301A6",
         "privateKey": "bd1c18d82b630756cc31ad0367152136d8557f9b69f627c4f9b3396f49bb82fd",
         "engaged": 0
 
     },
 
     "account2": {
         "publicAddress": "0x57949D5350d7257558551EdCc64FC0652278bDB5",
         "privateKey": "2fec58bc34e98daf5be932d0bffcedf325a6204f6109f6a35da1fc5de62678e5",
         "engaged": 0
 
     },
 
     "account3": {
         "publicAddress": "0x1bF8dC2A20FD3a0Da4D3FD1c049d7DCf38B61aA7",
         "privateKey": "469194a19a98ca2ded96f120b2fdd9a1dad67e3bd282263950e02260ea77bb35",
         "engaged": 0
     },
 
     "account4": {
         "publicAddress": "0x7b6A3b153eD139809e048c02EBBee9767492b103",
         "privateKey": "0265f2984458ef83b2bb0bf1f6cb14fe256a72bf2199a3f18a1b40e7c85760c2",
         "engaged": 0
     },
 
     "account5": {
         "publicAddress": "0xa87eD2544d39Bf7bb52C6104116F01E3195513fe",
         "privateKey": "15e6a35645cd0b1499c93e94f26293a7aab0c01eb5e1deadb7a9d9ef32dbbace",
         "engaged": 0
     },
 
     "account6": {
         "publicAddress": "0x4401fb6a20Dc8dc9065f4842045391290fE698Da",
         "privateKey": "2df7641c59cc4e9134263c98fb7780678c7d52256c4c53cf0ea4672e041dcc0c",
         "engaged": 0
     }
 
 
 };

 function getGanacheAccount(){
 
    for(var account in accountConfig){
      console.log(accountConfig[account]);
      if(accountConfig[account].engaged == 0){
      
        accountConfig[account].engaged = 1;
        console.log("see after toggle: ", accountConfig);
        return accountConfig[account];
      }
    }
    return 0;
  };

  function releaseGanacheAccount(acc){
      for(var account in accountConfig){
          console.log(accountConfig[account].publicAddress, ":", acc);
          if(accountConfig[account].publicAddress == acc){
              console.log("enters here and matches in rga: ");
              accountConfig[account].engaged = 0;
              return 1;
          }
      }

  }

  function sendOtp(toNum){
    const nexmo = new Nexmo({
        apiKey: 'deb24018',
        apiSecret: 'ywhTjoC0DOMZxNyn'
        })

        const from = 'Nexmo';
        const to = toNum;
        const text = Math.floor(Math.random() * 10000).toString();
        console.log("just sending");
        nexmo.message.sendSms(from, to, text)
        console.log("sent and returning now");
        return text;
  }

 app.get('/authOtp', (req, res) => {
     console.log("/number hit: ");
     
     var voterId = req.query.voterId;
     console.log("see what's here: ", voterId);

     MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("votersdb");
    
        dbo.collection("votersInfo").findOne({voterId: voterId}, function(err, result) {
            if (err) throw err;
            console.log(result.phoneNo);
            console.log("called sendotp");
    
           
            const nexmo = new Nexmo({
                apiKey: 'deb24018',
                apiSecret: 'ywhTjoC0DOMZxNyn'
                })
        
                const from = 'Nexmo';
                const to = result.phoneNo;
                console.log("see to: ", to, typeof(to));
                const text = Math.floor(Math.random() * 10000).toString();
                console.log("just sending");
                nexmo.message.sendSms(from, to, text, (err, responseData) => {
                    if(err) {
                        console.log("message not send: ", err);
                    }

                    else {
                        res.send(text);
                    }
                })
        })
    
      });
     
    
 })

 app.get('/check', (req, res) => {
     console.log("reaches here");
    
     res.send({account: getGanacheAccount()});
 })
 
 app.get('/release', (req, res) => {
     console.log("comes inside release")
     var account = req.query.account;

     if(releaseGanacheAccount(account) == 1){
         res.send({status : 1});
         console.log("inside if and res sent");
     }
     
 })

 app.listen(4000);
 
 