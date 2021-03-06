const {User, Note} = require('./model');
const {domServices} = require('./services');

let userController = {
	
	getHomePage: function (req, res) {
		User
			.findById(req.params.id) // req.user._id
			.populate('userNotes')
			.exec(function(err, user) {
				if (err) {
					console.log(err);
					return res.status(500).json({errMessage: "internal server error"})
				}

				if(!user) {
					return res.json({errorMsg: 'oops, user not found!'});
				}
				
				return user;
			}) 
			.then(function(json) {
				let notes = '';
				json.userNotes.forEach(function(note) {
 					notes += domServices.createUserFeedMarkup(note);
 	 			})
				return notes
			})
			.then(notes => {
				return res.cookie('id', req.params.id).status(200).send(domServices.getUserHomeMarkup(notes)); //just setting cookie for now.
			})
			.catch(err => {
		  		console.log(err);
		  		res.status(500).json({errorMsg: "internal server error"});
			})
	},

	createNewUser: function (req, res) {
		//verify that each of the fields exist after verifying that the body is not empty.
		if(!req.body) {
	 		return res.status(400).json({errorMsg: "Your request is empty and invalid."})
		}
	
		Object.keys(req.body).forEach(function(field) {
			let submittedValue = req.body[field];
			if(submittedValue.trim() === '') {
				return res.status(422).send(domServices.displaySignupError('Incorrect Length:' + field + ' is empty'));
			} 
			else if(typeof submittedValue !== 'string') {
				return res.status(422).send(domServices.displaySignupError('Incorrect datatype: ' + field + ' is wrong field type'));	
			}
		})
		
		let {username, email, password, passwordConfirmation} = req.body;

 		if(password !== passwordConfirmation) {
 			return res.status(422).send(domServices.displaySignupError('passwords do not match'));
 		}

		email = email.trim().toLowerCase(); 
		username = username.trim().toLowerCase();
		password = password.trim();
	
		//next check if user exists then create if it does not exist. 
		return User
				.find({username})
				.count()
				.exec()
				.then(count => {
					if(count>0) {
						res.status(422).send(domServices.displaySignupError('username already exists'));
					}
					return User.hashPassword(password)
				})
				.then(hash => {
					let newUser = new User ({
						email: email,
						username: username, 
						password: hash,
						userNotes: []
					});

					newUser.save(function(err, user) {
						if (err) {return console.log(err)};
						User
	   	 					.find(user.username)
	   	 					.exec()
	   	 					.then(res.status(201).send(domServices.getLoginMarkup('you have create a new account successfully, now login')))
	   	 					.catch(err => {
	   	 						console.log(err);
	   	 						res.status(500).json({errorMsg: "internal server error"});
	   	 					})
					});
				})
				.catch( err => {
					console.log(err);
					return res.json({errMessage: 'internal server error'});
				})
	},

	//this is for passport as well.
	signout: function (req, res) {
		try {
				req.session.destroy(function (err) {
					res.clearCookie('id').send(domServices.getLoginMarkup('you have signed out successfully')); //this is subject to change 
				})
  		}
		catch (err) {
			console.log(err);
			return res.status(500).json({errMessage: "internal server error"});
		}
	}, 

	//controller for passport
	redirectHome: function (req, res) {
    	res.redirect('/user/' + req.user._id);
  	}, 

  	getLogin: function (req, res) {
		res.send(domServices.getLoginMarkup('login page'))
  	},

  	failedLogin: function (req, res) {
  		res.send(domServices.getLoginMarkup('invalid username/password'));
  	}
}

let noteController = {

	getNote: function (req, res) {
		Note
			.findById({"_id": req.params.noteId})
			.exec(function(err, note) {
	 				if (err) {
	 					console.log(err)
	 					res.status(500).json({errorMsg: "internal server error"});
	 				};

	 				if(!note) {
	 					console.log('no user found here');
	 					return json({errMessage: "no user found here"});
	 				}
	 				
	 				return note
	 		})
	 		.then(note => {
	 			return res.status(200).json(note.noteAPIRepr());
	 		})
	 		.catch(err => {
	 			console.log(err);
	 			return res.json({errMessage: "internal server error"});
	 		})
	},

	deleteNote: function (req, res) {
		let note;
		Note
			.findByIdAndRemove(req.params.noteId, function(err, _note) {
				note = _note._id
				if(err) { 
					console.log(err);
					return res.status(500).json({errorMsg: "internal server error"}); 
				}
			
				if(!_note) {
					console.log('no note exists with the id given.');
					return res.status(500).json({errorMsg: "user not found!"});
				}
			})
			.exec()
			.then(function() {
		 		//remove the note ref object.
				User
					.findByIdAndUpdate(req.cookies.id, { $pull: {userNotes: note}}) //req.user._id
					.exec()
					.then(function () {
						res.status(204).end();
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({errorMsg: "internal server error"});
					})
			})
			.catch(err => {
				console.log(err);
				return res.status(500).json({errorMsg: "internal server errror"});
			})
	},

	//work with creating and updating the notes with the new schema
	updateNote: function (req, res) {
		let updatedFields = {};
		let newValues = { $set: updatedFields}

		Object.keys(req.body).forEach(function(field) {
			//leave id out of the update 
			if (field !== "id") {
				updatedFields[field] = req.body[field];
			}
		})
		
		Note
			.findByIdAndUpdate({"_id": req.params.noteId}, 
				newValues, 
				{new: true}, 
				function(err, doc) {
					if (err) {
						console.log(err);
						res.status(500).json({errorMsg: "internal server error"});
					}
					console.log(doc);
					res.status(204).end();
				})
	},
	
	createNote: function (req, res) {
		//start note consists of just writing the 
		//the titles for the note. so it is sort of the setup for the note. 
		let newNote = new Note ({
			"user": req.cookies.id,
			"title": req.body.title, 
			"content": req.body.content
		});

		newNote.save(function(err, note) {
			if (err) {return console.log(err)};
			User
	   	 		.findByIdAndUpdate(req.cookies.id, { $push: {userNotes: note._id}})
	   	 		.exec()
	   	 		.then(res.status(201).json(note.noteAPIRepr()))
	   	 		.catch(err => {
	   	 			console.log(err);
	   	 			res.status(500).json({errorMsg: "internal server error"});
	   	 		})
		});
	}
}

module.exports = {userController, noteController};