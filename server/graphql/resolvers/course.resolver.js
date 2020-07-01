const Course=require('../../models/course.model')
const Person=require('../../models/person.model')

const {CoursegqlParser}=require('./merge')

const checkAuth=require('../../util/check-auth')

//change this soon
const HardCodedPersonID="5ee3116c8c29144f6896ec89"

const HardCodedStudentID="5ee32198dff58d53283cc902"

module.exports = {
    Query: {
        async getCourses(){
            try{
                const searchedCourse=await Course.find().sort({createdAt: -1})
                return searchedCourse.map(course=>{
                    return CoursegqlParser(course)
                })
            }catch(err)
            {
                throw err
            }
        },
        async getCourse(_, {courseID}) {
            try {
            const course = await Course.findById(courseID)
            if (course){
                return CoursegqlParser(course)
            }
            else
            {
                throw new Error('Course not exist')
            }
            } catch (err) {
            throw new Error(err);
            }
        },
    },
    Mutation:{
        async createCourse(_, args, context)
        {
            const currUser=checkAuth(context)
            console.log(currUser)
            const newCourse=new Course({
                creator: currUser.id,
                code: args.courseInput.code,
                name: args.courseInput.name,
                session: args.courseInput.session
            })
            try{
                const creator=await Person.findById(currUser.id)
                
                if (creator)
                {
                    if (creator.userLevel!==1)
                        throw new Error('The user is not a lecturer but want to create course!')

                    const savedCourse=await newCourse.save()
                    creator.createdCourses.push(savedCourse)
                    await creator.save()
                    return CoursegqlParser(newCourse)
                }
                else
                    throw new Error('Creator not exist but create a course')
            }catch(err)
            {
                throw err
            }
        },
        async enrolCourse(_, {personID, courseID}, context)
        {
            try{
                const searchedCourse=await Course.findById(courseID)
                const student=await Person.findById(personID)

                if (!searchedCourse)
                    throw new Error('Course not exist but student wish to enrol!')

                const studentAlreadyEnrol=searchedCourse.enrolledStudents.find(s=>s==student.id)

                if (studentAlreadyEnrol)
                    throw new Error('Student already enrol the course')

                if (searchedCourse)

                if (!student)
                    throw new Error('Student not exist but wish to enrol course!')
                if (student.userLevel!==0)
                    throw new Error('The user is not a student but want to enrol course!')
                
                

                student.enrolledCourses.push(searchedCourse)
                await student.save()

                searchedCourse.enrolledStudents.push(student)
                await searchedCourse.save()

                    
                return CoursegqlParser(searchedCourse)
            }catch(err)
            {
                throw err
            }
        },
        async unEnrolCourse(_, {courseID}, context)
        {
            try{
                const course=await Course.findById(courseID)
                if (!course)
                    throw new Error('Course not exist but student wish to unenrol!')
                

                const checkStudentEnrolID=course.enrolledStudents.find(s=>s==HardCodedStudentID)
                const checkStudentEnrol=await Person.findById(checkStudentEnrolID)

                if (!checkStudentEnrol)
                    throw new Error('Student not enrol the course but wish to unenrol the course')

                if (checkStudentEnrol.userLevel!==0)
                    throw new Error('The user is not a student but want to unenrol course!')
                
                await Person.findByIdAndUpdate(
                    checkStudentEnrol.id,{$pull: {"enrolledCourses": course.id}},
                    { safe: true, upsert: true })

                await Course.findByIdAndUpdate(
                    course.id,{$pull: {"enrolledStudents": checkStudentEnrol.id}},
                    { safe: true, upsert: true })
                    
                return CoursegqlParser(course)
            }catch(err)
            {
                throw err
            }
        },
        async deleteCourse(_, {courseID}, context)
        {
            try{
                const courseToDelete=await Course.findById(courseID)
               
                if (!courseToDelete)
                    throw new Error('Try to delete a non existing course!')

               const creator=await Person.findByIdAndUpdate(
                    courseToDelete.creator,{$pull: {"createdCourses": courseToDelete.id}},
                    { safe: true, upsert: true })

                if (!creator)
                    throw new Error('Fail to delete course from creator, no creator found')

                await Person.updateMany({"enrolledCourses":  courseID}, {$pull:{"enrolledCourses": courseID}})

                await Course.deleteOne(courseToDelete)
                
                return CoursegqlParser(courseToDelete)
                
            }
            catch(err)
            {
                throw err
            }
        }
    }
}