const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// ========================================*========================================//
//                    create Instructor for a student                              //
// ========================================*========================================//



exports.createInstructor = async (req, res) => {
  try {
    const { name, email } = req.body;
    const bio = req.body.bio || '';
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }
    const instructor = await prisma.instructor.create({
      data: { name, email, bio }
    });
    res.status(201).json(instructor);
  } catch (error) {

    console.error(error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
}

// ========================================*========================================//
//                    Get ALL Instructor for a student                              //
// ========================================*========================================//


exports.getAllInstructor = async (req, res) => {
  try {
    const instructors = await prisma.instructor.findMany({
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            createdAt: true
          }
        }
      }
    });
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================*========================================//
//                    Get By Id Instructor for a student                            //
// ========================================*========================================//

exports.getByIdInstructor = async (req, res) => {
  const { id } = req.params;

  try {
    const instructor = await prisma.instructor.findUnique({

      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            courses: true
          }
        },
        courses: true
      }
      
    });
    // console.log(instructor);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found.' });
    }

    res.status(200).json(instructor);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// ========================================*========================================//
//                    update Instructor for a student                               //
// ========================================*========================================//


exports.updateInstructor = async (req, res) => {

  const { id } = req.params;

  try {
    const instructor = await prisma.instructor.update({

      where: { id: parseInt(id) },
      data: {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio
      }

    });

    res.status(200).json(instructor);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
}


// ========================================*========================================//
//                    delete Instructor for a student                               //
// ========================================*========================================//

exports.deleteInstructor = async (req, res) => {

  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid instructor ID' });
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

    // If the instructor has courses, delete enrollments & courses first
    if (instructor.courses.length > 0) {
      const courseIds = instructor.courses.map(c => c.id);

      // Delete enrollments linked to these courses
      await prisma.enrollment.deleteMany({
        where: { courseId: { in: courseIds } }
      });

      // Delete the courses
      await prisma.course.deleteMany({
        where: { id: { in: courseIds } }
      });
    }

    // Delete the instructor
    await prisma.instructor.delete({
      where: { id: instructorId }
    });

    res.status(200).json({ message: 'Instructor deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
