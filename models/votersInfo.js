
 var mongoose = require('mongoose');
 var voterschema = mongoose.Schema({

 	voterId : {
 		type : String,
 		required : true
 	},
 	phoneNo : {
 		type : String,
 		required : true
 	}
 });

 

 module.exports = mongoose.model('voterInfo', voterschema);

