var passport = require('passport');
var User = require('../models/user');

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, passsword, done){

    req.checkBody('email', 'invalid email').notEmpty().isEmail();
    req.checkBody('password', 'invalid password').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();

    if(errors) {

        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    };

    

    User.findOne({'email': email}, function(err, user){

        if(err){
            return done(err) ;
        }
        if(user){
          return done(null, false, {message: 'Email is already exists'});

        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(passsword);
        newUser.save(function(err, result) {
            if(err) {
                return done(err);
            }

            return done(null, newUser);
        })


    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, passsword, done){

    req.checkBody('email', 'invalid email').notEmpty().isEmail();
    req.checkBody('password', 'invalid password').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();

    if(errors) {

        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    };

    

    User.findOne({'email': email}, function(err, user){

        if(err){
            return done(err) ;
        }
        if(!user){
          return done(null, false, {message: 'User Not Found'});

        }

        if(!user.validPassword(passsword)) {
            return done(null, false, {message: 'Invalid Password'});

        }

        return done(null, user);
        

    });
}));







