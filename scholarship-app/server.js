const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Set up body-parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define where the uploaded files should be stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with storage options
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/scholarshipDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define your schema (ensure that this is defined somewhere in your project)
const scholarshipSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  grade: String,
  essay: String,
  adhaarCard: String,
  rationCard: String,
  incomeCertificate: String,
  marksheet: String,
  attendanceSheet: String,
  fatherName: String,
  fatherOccupation: String,
  motherName: String,
  motherOccupation: String,
  annualIncome: Number,
  bankAccountNumber: String,
  ifscCode: String
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

// Define your POST route
app.post("/submit_application", upload.fields([
  { name: 'adhaarCard' },
  { name: 'rationCard' },
  { name: 'incomeCertificate' },
  { name: 'marksheet' },
  { name: 'attendanceSheet' }
]), async (req, res) => {
  try {
    const { fullName, email, phone, grade, essay, fatherName, fatherOccupation, motherName, motherOccupation, annualIncome, bankAccountNumber, ifscCode } = req.body;

    const scholarshipData = new Scholarship({
      fullName,
      email,
      phone,
      grade,
      essay,
      adhaarCard: req.files.adhaarCard[0].path,
      rationCard: req.files.rationCard[0].path,
      incomeCertificate: req.files.incomeCertificate[0].path,
      marksheet: req.files.marksheet[0].path,
      attendanceSheet: req.files.attendanceSheet[0].path,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      annualIncome,
      bankAccountNumber,
      ifscCode
    });

    await scholarshipData.save();
    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error during form submission:", error);
    res.status(500).json({ message: "Error submitting application" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
