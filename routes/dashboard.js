var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url ="mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft";

exports.dashboard = function(req,res){
			 MongoClient.connect(url, function(err, db) {
			 		//console.log(req.session);
					if (err) throw err;
					res.render('dashboard',{
	     				 title:'Dashboard',	
	       				 user:req.session.passport.user.fname,
	       				 googleuser:req.session.passport.user.displayname,
	       				 pic:req.session.passport.user.profile_pic,
     				     msg:req.flash('success')
	           		});
			});
}

					

