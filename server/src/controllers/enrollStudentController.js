const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//controller to enroll a student in a course
exports.enrollStudent = async (req, res) => {
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId || isNaN(studentId) || isNaN(courseId)) {
    return res.status(400).json({ error: 'Invalid studentId or courseId' });
  }
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
    });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: parseInt(studentId),
          courseId: parseInt(courseId),
        },
      },
    });
    if (existing) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: parseInt(studentId),
        courseId: parseInt(courseId),
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ========================================*========================================//
//                     Get all enrollments for a student                            //
// ========================================*========================================//

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          select: { name: true } // only student name
        },
        course: {
          select: {
            title: true,
            thumbnail: true,
            instructor: {
              select: { name: true } // only instructor name
            }
          }
        }
      }
    });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// ========================================*========================================//
//                     Get by id enrollments for a student                          //
// ========================================*========================================//


exports.getEnrollmentById = async (req, res) => { 
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid enrollment ID' });
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: {
          select: { name: true }
        },
        course: {
          select: {
            title: true,
            thumbnail: true,
            instructor: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // const formatted = {
    //   thumbnail: enrollment.course.thumbnail,
    //   courseTitle: enrollment.course.title,
    //   instructorName: enrollment.course.instructor.name,
    //   studentName: enrollment.student.name
    // };
    res.status(200).json(enrollment);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// ========================================*========================================//
//                    update enrollments for a student                              //
// ========================================*========================================//
exports.updateEnrollment = async (req, res) => { 
  const { id } = req.params;
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId || isNaN(studentId) || isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid studentId or courseId' });
    }
    const enrollment = await prisma.enrollment.update({
      where: { id: parseInt(id) },
      data: {
        studentId: parseInt(studentId),
        courseId: parseInt(courseId)
      }
    });
    res.status(200).json(enrollment);
  } catch (error) {
     if (err.code === "P2025") {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(500).json({ error: error.message });
  }
}

// ========================================*========================================//
//                    delete enrollments for a student                              //
// ========================================*========================================//

exports.deleteEnrollment = async (req, res) => { 
  const { id } = req.params;
  try {
    const enrollment = await prisma.enrollment.delete({
      where: { id: parseInt(id) }
      });
    res.status(200).json({
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
      if (err.code === "P2025") {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(500).json({ error: error.message });
  }
}
