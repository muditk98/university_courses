const express = require('express');

let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());



app.set('views', './views');
app.set('view engine', 'pug');

app.get('/course', (req, res) => {
	res.render('course', {
		course_name: "JS"
	})
})

app.post('/course', (req, res) => {
	if (req.body.action == 'add' && courseExists(id)) {
		
	}
})

app.post('/course', (req, res) => {
	res.render('course', {
		course_name: req.body.course_name
	})
})

app.listen(3000);