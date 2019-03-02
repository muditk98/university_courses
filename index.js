const express = require('express');
const university = require('./university')

let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

app.locals.university = new university.University()

app.set('views', './views');
app.set('view engine', 'pug');


app.get('/', (req, res) => {
	res.render('home')
})

app.get('/course', (req, res) => {
	res.render('course')
})
app.post('/course', (req, res) => {
	try {
		if (req.body.action == 'add') {
			let course = new university.Course(req.body.id, req.body.name)
			app.locals.university.addCourse(course)
			res.render('course', {
				message: 'Course successfully added'
			})
		} else if (req.body.action == 'delete') {
			app.locals.university.deleteCourse(req.body.id)
			res.render('course', {
				message: 'Course sucessfully deleted'
			})
		} else if (req.body.action == 'view') {
			let course = new university.Course(req.body.id, req.body.name)
			res.render('list_view', app.locals.university.filterCourse(course))
		} else if (req.body.action == 'activate') {
			app.locals.university.activateCourse(req.body.id)
			res.render('course', {
				message: 'Course successfully activated'
			})
		} else if (req.body.action == 'deactivate') {
			app.locals.university.deactivateCourse(req.body.id)
			res.render('course', {
				message: 'Course successfully deactivated'
			})
		} else {
			res.render('error', new Error('Invalid action'))
		}
	} catch (error) {
		res.render('error', error)
	}
})

app.get('/student', (req, res) => {
	res.render('student')
})

app.post('/student', (req, res) => {
	try {
		if (req.body.action == 'add') {
			let student = new university.Student(req.body.id, req.body.name)
			app.locals.university.addStudent(student)
			res.render('student', {
				message: 'Student successfully added'
			})
		} else if (req.body.action == 'delete') {
			app.locals.university.deleteStudent(req.body.id)
			res.render('student', {
				message: 'Student sucessfully deleted'
			})
		} else if (req.body.action == 'view') {
			let student = new university.Student(req.body.id, req.body.name)
			res.render('list_view', app.locals.university.filterStudent(student))
		} else {
			res.render('error', new Error('Invalid action'))
		}
	} catch (error) {
		res.render('error', error)
	}
})

app.get('/map', (req, res) => {
	res.render('map')
})
app.post('/map', (req, res) => {
	try {
		let csmap = new university.CourseStudentMap(req.body.course_id, req.body.student_id)
		res.render('list_view', app.locals.university.filterMap(csmap))
	} catch (error) {
		res.render('error', error)
	}
})

app.listen(3000);