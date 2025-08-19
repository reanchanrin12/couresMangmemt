const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();




// ========================================*========================================//
//                        CREAT  Student                                            //
// ========================================*========================================//

exports.createStudent = async (req, res) => {
  try {

    const { name, email } = req.body;

    const student = await prisma.student.create({
      data: {
        name,
        email
      }
    });

    res.status(201).json(student);
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
}


// ========================================*========================================//
//                        GET   Student                                            //
// ========================================*========================================//



exports.getAllStudent = async (req, res) => {
  try {

    const student = await prisma.student.findMany({
      include: {
        enrollments: {
          include: {
            course: true,

          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}


// ========================================*========================================//
//                        GET by id   Student                                      //
// ========================================*========================================//


exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({

      where: { id: parseInt(id) },
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    res.status(200).json(student);
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
}


// ========================================*========================================//
//                             Update  Student                                      //
// ========================================*========================================//



exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    
    const student = await prisma.student.update({

      where: { id: parseInt(id) },
      data: {
        name: req.body.name,
        email: req.body.email
      }
    });

    res.status(200).json(student);
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
}


// ========================================*========================================//
//                             Delete  Student                                      //
// ========================================*========================================//

exports.deleteStudent = async (req, res) => {

  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }

  try {
    const instructorId = parseInt(id);

    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
      include: { courses: true }
    });

    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    
    if (instructor.courses.length > 0) { 

      const courseIds = instructor.courses.map(c => c.id);
      
      await prisma.enrollment.deleteMany({
        where: { courseId: { in: courseIds } }
      });

      await prisma.course.deleteMany({
        where: { id: { in: courseIds } }
      });

          await prisma.instructor.delete({
      where: { id: instructorId }
    });
    }

    res.status(200).json({ message: 'Instructor deleted successfully' });


   } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
