
```markdown
# 📘 Course Management System API

A RESTful API built with **Node.js**, **Express**, and **Prisma** (assumed) to manage **Instructors**, **Courses**, **Students**, and **Enrollments**. This backend supports CRUD operations and file uploads for course thumbnails.

---

## 🧩 Features

- ✅ **Instructor Management**
- ✅ **Course Management** (with thumbnail upload)
- ✅ **Student Management**
- ✅ **Enrollment System** (students enrolled in courses)
- 🖼️ **File Upload Support** via `multer` middleware
- 🔁 RESTful API design with clean routing

---

## 📁 Project Structure

```
project-root/
│
├── routes/
│   ├── courseRoutes.js
│   ├── studentRoutes.js
│   ├── instructorRoutes.js
│   └── enrollmentRoutes.js
│
├── controllers/
│   ├── courseController.js
│   ├── studentController.js
│   ├── instructorController.js
│   └── enrollStudentController.js
│
├── middleware/
│   └── uploadMiddleware.js
│
├── uploads/
│   └── (stored thumbnails)
│
└── package.json
```

---

## 🚀 Available Routes

### 1. **Instructor Routes** (`/instructor`)

| Method | Route                     | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | `/create/instructor`      | Create a new instructor        |
| GET    | `/list/instructor`        | Get all instructors            |
| GET    | `/read/instructor/:id`    | Get instructor by ID           |
| PUT    | `/update/instructor/:id`  | Update instructor by ID        |
| DELETE | `/delete/instructor/:id`  | Delete instructor by ID        |

---

### 2. **Course Routes** (`/course`)

| Method | Route                        | Description                                |
|--------|------------------------------|--------------------------------------------|
| POST   | `/course`                    | Create a new course (with thumbnail)       |
| GET    | `/course/with-students`      | Get all courses with enrolled students     |
| GET    | `/course/list`               | Get list of all courses                    |
| GET    | `/course/:id`                | Get course by ID                           |
| PUT    | `/course/update/:id`         | Update course (with optional thumbnail)    |
| DELETE | `/course/delete/:id`         | Delete course by ID                        |

> 🖼️ `thumbnail` must be uploaded as `multipart/form-data` field `thumbnail`.

---

### 3. **Student Routes** (`/student`)

| Method | Route                   | Description                   |
|--------|-------------------------|-------------------------------|
| POST   | `/student`              | Create a new student          |
| GET    | `/student/list`         | Get all students              |
| GET    | `/student/read/:id`     | Get student by ID             |
| PUT    | `/student/update/:id`   | Update student by ID          |
| DELETE | `/student/delete/:id`   | Delete student by ID          |

---

### 4. **Enrollment Routes** (`/enroll`)

| Method | Route                   | Description                           |
|--------|-------------------------|---------------------------------------|
| POST   | `/enroll/create`        | Enroll a student in a course          |
| GET    | `/enroll/list`          | Get all enrollments                   |
| GET    | `/enroll/read/:id`      | Get enrollment by ID                  |
| PUT    | `/enroll/update/:id`    | Update enrollment (e.g., status)      |
| DELETE | `/enroll/delete/:id`    | Unenroll (delete enrollment record)   |

---

## 📤 Sample Request (Create Instructor)

```json
POST /create/instructor
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "bio": "Frontend developer and mentor"
}
```

---

## 📤 Sample Request (Create Course with Thumbnail)

```txt
POST /course
Content-Type: multipart/form-data

Fields:
- title: "Introduction to React"
- description: "Learn React from scratch"
- instructorId: 1
- thumbnail: [File upload: react-thumb.jpg]
```

> 💡 Use **Postman** or **curl** to send `form-data`.

---

## 📥 Sample Response

```json
{
  "id": 1,
  "title": "Introduction to React",
  "description": "Learn React from scratch",
  "thumbnail": "react-thumb.jpg",
  "instructorId": 1,
  "createdAt": "2025-04-05T10:00:00.000Z"
}
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/course-management-api.git
   cd course-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env`:
   ```env
   PORT=3000
   DATABASE_URL="your-database-url"
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **API is now running at**
   ```
   http://localhost:3000
   ```

---

## 📂 File Uploads

- Thumbnail images are handled by `uploadMiddleware.js` using `multer`.
- Files are saved in the `uploads/` folder.
- Access thumbnails via static file serving (ensure it's enabled in main `app.js`):

```js
app.use('/uploads', express.static('uploads'));
```

> Example image URL: `http://localhost:3000/uploads/react-thumb.jpg`

---

## 🛠️ Middleware

- `upload.single('thumbnail')`: Parses `multipart/form-data` for course thumbnails.
- Extendable for validation, authentication (e.g., JWT), and error handling.

---

## 🧪 Testing with Postman

- Import the collection (optional): [Download Postman Collection](#) (add link if available).
- Use environment variables for base URL: `{{base_url}}/course`
- For bulk data insertion, use **CSV data files** in Postman Runner.

---

## 📈 Future Improvements

- Add authentication (JWT)
- Input validation (using `Joi` or `zod`)
- Pagination for list endpoints
- Search & filtering
- Swagger/OpenAPI documentation

---

## 🙌 Credits

Developed with ❤️ using **Express.js**, **Prisma ORM**, and **Postman** for testing.

---

## 📬 Contact

For issues or contributions, open an issue or contact the developer.

> ✅ API ready for integration with frontend apps (React, Vue, etc.) or mobile clients.
```

---

### ✅ Notes

- Make sure your main `app.js` or `server.js` registers these routes:
  ```js
  app.use('/api', require('./routes/instructorRoutes'));
  app.use('/api', require('./routes/courseRoutes'));
  app.use('/api', require('./routes/studentRoutes'));
  app.use('/api', require('./routes/enrollmentRoutes'));
  ```
  Or use prefixes:
  ```js
  app.use('/api', instructorRoutes);
  app.use('/api', courseRoutes);
  ```

