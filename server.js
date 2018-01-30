var express =  require('express');
var routes = require('./routes/main');
var profile = require('./routes/dashboard');
var path = require('path');
var http = require('http');
var session = require('express-session');
var bodyparser = require('body-parser');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url ="mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft";
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login');
var md5 = require('md5');
var flash = require('connect-flash');

var app = express();
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 100000 }
}))

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

 //Body Parser Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
				username: 'email',
  			password: 'password'
			},
		    function(username, password, done) {
			    
			    MongoClient.connect(url, function(err, db) {
					if (err) throw err;
					var pass = md5(password);
					var query = { email:username, password:pass};
				  	db.collection("users").findOne(query, function (err,users) {
				  	//console.log(users.fname);	
				    if (err) { return done(err); }
				      
				    if (!users) {
				    	return done(null, false, { message: 'Incorrect username or password' });
				    }
				      		
					return done(null, users);
								
				    });
				});
		   }
	   ));

passport.use(new GoogleStrategy({
    clientID: '950125656138-d3anteokf43o0sbviqbvb0aqk2tadi0u.apps.googleusercontent.com',
    clientSecret: 'jDuuf60yzY1T_hzRM5oEdd18',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  		// console.log(profile);
    //    User.find({ googleId: profile.id }, function (err, user) {
       	 //console.log(profile);
       	MongoClient.connect(url, function(err, db) {
         if(err) throw err;
          db.collection("users").findOne({ googleId: profile.emails[0].value }, function (err,users) {
          if(users)
          {
              //console.log(users);
              var myquery = { 
                              googleId:users.googleId,
                              displayname:users.displayname,
                              profile_pic:users.profile_pic
                            };
              var newvalues = { 
                                googleId:profile.emails[0].value,
                                displayname:profile.displayName,
                                profile_pic:profile.photos[0].value
                              };
              db.collection("users").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
              });
              //console.log(profile.photos[0].value);
          	 return done(null,users);
          }	
          if(!users)
    		   {
    		     	db.collection("users").insert({googleId: profile.emails[0].value,displayname:profile.displayName,profile_pic:profile.photos[0].value}),function(err,users){
    		     		if(err) throw err;
    		     		console.log("Inserted");
                res.redirect('/');
    		     		return done(null,users);	
    		     		db.close();
    		     	}	
    		   } 
          
           
   //       else{
   //       	var newUser = new User();
   //       	newUser.google.id = profile.id;
   //       	newUser.google.token = accessToken;
   //       	newUser.google.name = profile.displayName;
   //       	newUser.google.email = profile.emails[0].value;  

   //       	newUser.save(function(err){
   //       		if(err)
   //      		  throw err;
   //      		return done(null,newUser);
			// })
			// console.log(profile);  
   //       }

       });
   });
  }
));


passport.use(new FacebookStrategy({
    clientID: '338242206671278',
    clientSecret: 'd0b9d016565055e4fc624414d229bfce',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  		 console.log(profile);
    //    User.find({ googleId: profile.id }, function (err, user) {
       	// console.log(profile);
       	MongoClient.connect(url, function(err, db) {
         if(err) throw err;
         	//return done(err, user);
        db.collection("users").findOne({ googleId: profile.id }, function (err,users) {
        	console.log(users);
   //        if (err) { return done(err); }
          
           return done(null,users);
   //       else{
   //       	var newUser = new User();
   //       	newUser.google.id = profile.id;
   //       	newUser.google.token = accessToken;
   //       	newUser.google.name = profile.displayName;
   //       	newUser.google.email = profile.emails[0].value;  

   //       	newUser.save(function(err){
   //       		if(err)
   //      		  throw err;
   //      		return done(null,newUser);
			// })
			// console.log(profile);  
   //       }

       });
   });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
 	done(null, user);
});

app.get('/',routes.index);
app.get('/logout',routes.logout);
app.get('/dashboard',ensureLoggedIn,profile.dashboard);
app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
app.get('/auth/google/callback',passport.authenticate('google',{successRedirect:'/dashboard',successFlash: 'Welcome!',failureRedirect:'/',failureFlash: true}));
app.post('/process', passport.authenticate('local', { successRedirect: '/dashboard',successFlash: 'Welcome!',failureRedirect: '/',failureFlash: true}));
app.get('/privacy',routes.privacy);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on Ejsport ' + app.get('port'));
});
