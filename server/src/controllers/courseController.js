const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');



// get all courses with instructor details

exports.listCourse = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
      }
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found.' });
    }
    console.log('courses', courses);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//create a new course
exports.createCourse = async (req, res) => {
  try {
    const { description, instructorId } = req.body;
    const title = req.body.title || req.body[' title '];
    if (!title || !description || !instructorId) {
      return res.status(400).json({ message: 'Title, description, and instructorId are required.' });
    }
    const thumbnail = req.file?.filename;
    console.log("Uploaded thumbnail:", thumbnail);
    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        instructorId: parseInt(instructorId)
      }
    });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

// Get all courses with students enrolled
exports.getCoursesWithStudents = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found.' });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  // fallback for undefined req.body
  const body = req.body || {};
  const title = body.title || body[' title '];
  const description = body.description;
  const instructorId = body.instructorId;

  try {
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (instructorId) updateData.instructorId = parseInt(instructorId);
    if (req.file) updateData.thumbnail = req.file.filename;

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.status(200).json({
      updatedCourse,
      message: 'Course updated successfully'
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "រកមិនឃើញ course" });
    }
    res.status(500).json({ error: error.message });
  }
};

// GET a course by ID
exports.readCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        instructor: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    })
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//delete a course
exports.deleteCourse = async (req, res) => { 
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    if (course.thumbnail) {
      const filePath = path.join(__dirname, '../../uploads', course.thumbnail);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('Thumbnail deleted:', course.thumbnail);
        }
      });
    }
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
