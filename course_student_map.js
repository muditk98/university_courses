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
			new Course(1001, 'JavaScript'),
			new Course(1002, 'LinearAlgebra'),
			new Course(1003, 'Calculus-3')
		]
		this.students = [
			new Student(2001, 'Mudit Kapoor'),
			new Student(2002, 'Acerola Orion')
		]
		this.map = [
			new CourseStudentMap(1001, 2001),
			new CourseStudentMap(1001, 2002),
			new CourseStudentMap(1002, 2001)
		]
	}
	courseExists(id) {
		for (let i = 0; i < this.courses.length; i++) {
			if (this.courses[i].id === id) {
				return true
			}
		}
		return false
	}
	studentExists(id) {
		for (let i = 0; i < this.students.length; i++) {
			if (this.students[i].id === id) {
				return true
			}
		}
		return false
	}
	addCourse(course) {
		const schema = Joi.object().keys({
			id: Joi.number().positive().required(),
			name: Joi.string().required(),
		})
		let result = Joi.validate(course, schema, {presence: 'required'})
		if (result.error) {
			throw result.error
		}
		if (!this.courseExists(id)) {
            this.courses.push(course)
		} else {
			throw new Error('Course with this id already exists')
		}
	}
	deleteCourse(id) {
		this.map = this.map.filter(value => {
			value.course_id !== id
		})
		this.courses = this.courses.filter(value => {
			value.id !== id
		})
	}
	addStudent(student) {
		const schema = Joi.object().keys({
			id: Joi.number().positive().required(),
			name: Joi.string().required(),
		})
		let result = Joi.validate(student, schema, {
			presence: 'required'
		})
		if (result.error) {
			throw result.error
		}
		if (!this.studentExists(id)) {
			this.students.push(student)
		} else {
			throw new Error('Student with this id already exists')
		}
	}
	deleteStudent(id) {
		this.map = this.map.filter(value => {
			value.student_id !== id
		})
		this.students = this.students.filter(value => {
			value.id !== id
		})
	}
}