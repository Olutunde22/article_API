const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const MongoURL = 'mongodb://localhost:27017/wikiDB';
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

mongoose.connect(
	MongoURL,
	{
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (!err) {
			console.log('Connected to mongoDB');
		} else {
			console.log(err);
		}
	}
);

const articleSchema = mongoose.Schema({
	title: String,
	content: String,
});

const Article = mongoose.model('Article', articleSchema);

////////////// For requests to all article ///////////////////////
app
	.route('/articles')
	.get((req, res) => {
		Article.find({}, (err, results) => {
			if (!err) {
				res.send(results);
			} else {
				res.send(err);
			}
		});
	})
	.post((req, res) => {
		const title = req.body.title;
		const content = req.body.content;

		if(title === "" || title === undefined || title === null){
			res.send('Title cannot be blank')
		}

		const newArticle = new Article({
			title: title,
			content: content,
		});

		newArticle.save((err) => {
			if (!err) {
				res.send('Saved to database');
			} else {
				res.send(err);
			}
		});
	})
	.delete((req, res) => {
		Article.deleteMany({}, (err) => {
			if (!err) {
				res.send('Deleted all documents in collection');
			} else {
				res.send(err);
			}
		});
	});

////////////// For requests to a specific article ///////////////////////

app
	.route('/article/:title')
	.get((req, res) => {
		const title = req.params.title;
		Article.findOne({ title: title }, (err, results) => {
			if (!err) {
				if (results) {
					res.send(results);
				} else {
					res.send('No articles matching title found');
				}
			} else {
				res.send(err);
			}
		});
	})
	.put((req, res) => {
		const paramTitle = req.params.title;
		const bodyTitle = req.body.title;
		const content = req.body.content;
		Article.updateOne(
			{ title: paramTitle },
			{ title: bodyTitle, content: content },
			(err, results) => {
				if (!err) {
					res.send('Updated document successfully');
				} else {
					res.send(err);
				}
			}
		);
	})
	.patch((req, res) => {
		const paramTitle = req.params.title;
		Article.updateOne({ title: paramTitle }, { $set: req.body }, (err, results) => {
			if (!err) {
				res.send('Updated document successfully');
			} else {
				res.send(err);
			}
		});
	})
	.delete((req, res) => {
		const title = req.params.title;
		Article.deleteOne({ title: title }, (err) => {
			if (!err) {
				res.send('Deleted document from collection');
			} else {
				res.send(err);
			}
		});
	});

app.listen(PORT, (err) => {
	if (!err) {
		console.log('Connected on Port ' + PORT);
	}
});
