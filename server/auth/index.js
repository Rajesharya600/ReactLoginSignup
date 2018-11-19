const express = require('express')
const router = express.Router()
const User = require('../db/models/user')
const passport = require('../passport')
const randomstring = require('randomstring')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	})
)

// this route is just used to get the user basic info
router.get('/user', (req, res, next) => {
	console.log('===== user!!======')
	console.log(req.user)
	if (req.user) {
		return res.json({ user: req.user })
	} else {
		return res.json({ user: null })
	}
})

router.post(
	'/login',
	function(req, res, next) {
		console.log(req.body)
		console.log('================')
		next()
	},
	passport.authenticate('local'),
	(req, res) => {
		console.log('POST to /login')
		if(req.user && req.user.local && req.user.local.verified) {
            const user = JSON.parse(JSON.stringify(req.user)) // hack
            const cleanUser = Object.assign({}, user)
            if (cleanUser.local) {
                console.log(`Deleting ${cleanUser.local.password}`)
                delete cleanUser.local.password
            }
            res.json({user: cleanUser})
        } else {
            req.session.destroy();
            res.json({status: "unverified"})
		}
	}
)

router.post('/logout', (req, res) => {
	if (req.user) {
		req.session.destroy()
		res.clearCookie('connect.sid') // clean up!
		return res.json({ msg: 'logging you out' })
	} else {
		return res.json({ msg: 'no user to log out!' })
	}
})

router.post('/signup', (req, res) => {
	const { email, password } = req.body
	// ADD VALIDATION
	User.findOne({ 'local.email': email }, (err, userMatch) => {
		if (userMatch) {
			return res.json({
				error: `Sorry, An account is already registered this email. Please login..!`
			})
		}

        var verification_token = randomstring.generate({
            length: 64
        });

        const newUser = new User({
			'local.email': email,
			'local.password': password,
			'local.verify_token' : verification_token,
			'local.verified' : false,
		});
		newUser.save((err, savedUser) => {
			if (err) {
				return res.json(err);
				console.log('Email error');
			} else {
				var url = `${req.protocol}://${req.hostname}`;
				sendVerificationMail(email, verification_token,url);
                return res.json(savedUser)
            }
		})
	})
})

router.get('/verify', function (req, res) {
    var token = req.params.token;
    console.log('rajat2',req.url)
    User.findOne({'local.token': token}, function (err, user) {
    	if(user.local.verified == true){
            return res.json({ status:"expired", msg: 'Invalid or expired link.' })
		} else if (user.local.verify_token == token) {
            User.findOneAndUpdate({'local.token': token}, {'local.verified': true}, function (err, resp) {
                console.log('The user has been verified!');
				console.log(resp)
            });
            return res.json({ status:"success", msg: 'Email verified successfully.' })
        } else {
            console.log('The token is wrong! Reject the user. token should be: ' + user.local.verify_token);
            return res.json({ status:"error", msg: 'Invalid verification link' })
        }
    });
});

function sendVerificationMail(email, verification_token,url) {
	const msg = {
	  to: email,
	  from: 'support@heroku.com',
	  subject: `Confirm your email address on React App`,
	  text: verification_token,
	  html: `<p>Hello! We just need to verify that ${email} is your email address.</p>
			<p>
				<a href="${url}/verify/${verification_token}">Click here to confirm</a>
			</p>
			<p><strong>Didn't request this email?</strong>
			No worries! Your address may have been entered by mistake. If you ignore or delete this email, nothing further will happen.</p>`,
	};
	sgMail.send(msg);
}
module.exports = router
