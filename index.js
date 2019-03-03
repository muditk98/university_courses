const express = require('express');
const university = require('./university')

let app = express();
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
app.use(express.static('./css'))

app.locals.university = new university.University()

app.set('views', './views');
app.set('view engine', 'pug');


app.get(['/', '/home'], (req, res) => {
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
			res.render('list_view', {
				cols: ['Course Id', 'Course Name', 'Activated'],
				data: app.locals.university.filterCourse(course)
			})
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
			throw new Error('Invalid action')
		}
	} catch (error) {
		res.render('course', {
			message: "Error: " + error.message
		})
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
			res.render('list_view', {
				cols: ['Student Id', 'Student Name'],
				data: app.locals.university.filterStudent(student)
			})
		} else {
			throw new Error('Invalid action')
		}
	} catch (error) {
		res.render('student', {
			message: "Error: " + error.message
		})
	}
})

app.get('/course/:id', (req, res) => {
	try {
		let course = new university.Course(req.params.id, '')
		// res.render('list_view', {
		// 	cols: ['Course Id', 'Course Name', 'Activated'],
		// 	data: app.locals.university.filterCourse(course)
		// })
		res.send(app.locals.university.filterCourse(course))
	} catch (error) {
		res.send(error)
	}
}) 
app.get('/student/:id', (req, res) => {
	try {
		let student = new university.Student(req.params.id, '')
		// res.render('list_view', {
		// 	cols: ['Student Id', 'Student Name'],
		// 	data: app.locals.university.filterStudent(student)
		// })
		res.send(app.locals.university.filterStudent(student))
	} catch (error) {
		res.send(error)
	}
})

app.get('/map', (req, res) => {
	res.render('map')
})
app.post('/map', (req, res) => {
	try {
		if (req.body.action == 'add') {
			app.locals.university.addCourseStudentMap(req.body.course_id, req.body.student_id)
			res.render('map', {
				message: 'Student successfully registered to course'
			})
		} else if (req.body.action == 'delete') {
			app.locals.university.deleteCourseStudentMap(req.body.course_id, req.body.student_id)
			res.render('map', {
				message: 'Student sucessfully deregistered from course'
			})
		} else if (req.body.action == 'view') {
			let csmap = new university.CourseStudentMap(req.body.course_id, req.body.student_id)
			res.render('list_view', {
				cols: ['Course Id', 'Student Id'],
				data: app.locals.university.filterMap(csmap)
			})
		} else {
			throw new Error('Invalid action')
		}
	} catch (error) {
		res.render('map', {
			message: "Error: " + error.message
		})
	}
})

app.listen(3000);