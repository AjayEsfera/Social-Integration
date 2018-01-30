var md5 = require('md5');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url ="mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft";

exports.index = function(req, res) {
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
			  res.render('login',{
	        	title:'Login Form',
	        	message:req.flash('error')
	          });
	    });
        
    }
exports.privacy = function(req,res){
	res.render('privacy');
}	
// exports.process = function(req, res) {
        	
// 		var email = req.body.email;
// 		var pass = md5(req.body.password);
// 		MongoClient.connect(url, function(err, db) {
// 		  if (err) throw err;
// 		  db.collection("users").find({email:email, password:pass}).toArray(function(err, result) {
// 		    if (err) throw err;
		  
// 		    if(email === result[0].email && pass === result[0].password)
// 		    	{
// 		    		var sess = req.session;
// 		    		sess.user = result[0].fname;
// 		    		res.redirect('/dashboard');  
// 		    	}
// 		    	else
// 		    	{
// 		    		res.redirect('/');
// 		    	}
// 		    db.close();
// 		  });
// 		});
//     }

exports.logout = function(req, res) {
	 req.session.destroy(function(err) {
	  if(err) throw err;
	  console.log('Logout');
	   res.redirect('/');
	 });
}
