const Joi = require('joi')

class Course {
	constructor(id, name) {
		this.id = id
		this.name = name
		this._status = false
	}
	activate() {
		this._status = true
	}
	deactivate() {
		this._status = false
	}
	getStatus() {
		return this._status
	}
}

class Student {
	constructor(id, name) {
		this.id = id
		this.name = name
	}
}

class CourseStudentMap {
	constructor(course_id, student_id) {
		this.course_id = course_id
		this.student_id = student_id
	}
}

class University {
	constructor() {
		this.courses = [
			new Course("1001", 'JavaScript'),
			new Course("1002", 'LinearAlgebra'),
			new Course("1003", 'Calculus-3')
		]
		this.students = [
			new Student("2001", 'Mudit Kapoor'),
			new Student("2002", 'Acerola Orion')
		]
		this.map = [
			new CourseStudentMap("1001", "2001"),
			new CourseStudentMap("1001", "2002"),
			new CourseStudentMap("1002", "2001")
		]
	}
	courseExists(id) {
		return this.courses.some(course => {
			return course.id == id
		})
	}
	studentExists(id) {
		return this.students.some(student => {
			return student.id == id
		})
	}
	mapExists(course_id, student_id) {
		return this.map.some(value => {
			return value.course_id == course_id && value.student_id == student_id
		})
	}
	addCourse(course) {
		const schema = Joi.object().keys({
			id: Joi.string().regex(/^[1-9]\d{0,3}$/).required(),
			name: Joi.string().required(),
			_status: Joi.bool()
		})
		let result = Joi.validate(course, schema, {presence: 'required'})
		if (result.error) {
			throw result.error
		}
		if (!this.courseExists(course.id)) {
			this.courses.push(course)
		} else {
			throw new Error('Course with this id already exists')
		}
	}
	deleteCourse(id) {
		this.map = this.map.filter(value => {
			return value.course_id != id
		})
		this.courses = this.courses.filter(value => {
			return value.id != id
		})
	}
	filterCourse(course) {
		if (course.id == null) {
			course.id = ''
		}
		if (course.name == null) {
			course.name = ''
		}
		return this.courses.filter(value => {
			return new RegExp(course.id.trim(), 'i').test(value.id) && new RegExp(course.name.trim(), 'i').test(value.name)
		})
	}
	activateCourse(id) {
		let courses = this.filterCourse(new Course(id, ''))
		if (!courses.length) {
			throw new Error('Invalid course id')
		}
		if (this.filterMap(new CourseStudentMap(id, '')).length < 5) {
			throw new Error('Cannot activate course with less than 5 students')
		}
		courses[0].activate()
	}
	deactivateCourse(id) {
		let courses = this.filterCourse(new Course(id, ''))
		if (courses.length) {
			courses[0].deactivate()
		}
	}
	addStudent(student) {
		const schema = Joi.object().keys({
			id: Joi.string().regex(/^[1-9]\d{0,3}$/).required(),
			name: Joi.string().required(),
		})
		let result = Joi.validate(student, schema, {
			presence: 'required'
		})
		if (result.error) {
			throw result.error
		}
		if (!this.studentExists(student.id)) {
			this.students.push(student)
		} else {
			throw new Error('Student with this id already exists')
		}
	}
	deleteStudent(id) {
		this.map = this.map.filter(value => {
			return value.student_id != id
		})
		this.students = this.students.filter(value => {
			return value.id != id
		})
	}
	filterStudent(student) {
		if (student.id == null) {
			student.id = ''
		}
		if (student.name == null) {
			student.name = ''
		}
		return this.students.filter(value => {
			return new RegExp(student.id.trim(), 'i').test(value.id) && new RegExp(student.name.trim(), 'i').test(value.name)
		})
	}
	addCourseStudentMap(course_id, student_id) {
		if (!this.courseExists(course_id)) {
			throw new Error('Course does not exist')
		}
		if (!this.studentExists(student_id)) {
			throw new Error('Student does not exist')
		}
		if (this.mapExists(course_id, student_id)) {
			throw new Error('Student already registered under this course')
		}
		let course = new Course(course_id, '')
		if (this.filterCourse(course)[0].getStatus() == true) {
			throw new Error('Cannot enroll for active course')
		}
		this.map.push(new CourseStudentMap(course_id, student_id))
	}
	deleteCourseStudentMap(course_id, student_id) {
		let courses = this.filterCourse(new Course(course_id, ''))
		if (courses.length && courses[0].getStatus()) {
			throw new Error('Cannot deregister after course has started')
		}
		this.map = this.map.filter(value => {
			return value.course_id != course_id && value.student_id != student_id
		})
	}
	filterMap(csmap) {
		if (csmap.course_id == null) {
			csmap.course_id = ''
		}
		if (csmap.student_id == null) {
			csmap.student_id = ''
		}
		return this.map.filter(value => {
			return 	new RegExp(csmap.course_id.trim(), 'i').test(value.course_id) &&
					new RegExp(csmap.student_id.trim(), 'i').test(value.student_id)
		})
	}
}

exports.Course = Course
exports.Student = Student
exports.CourseStudentMap = CourseStudentMap
exports.University = University