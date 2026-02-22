import mongoose from "mongoose";

const logbookSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  internshipTitle: { 
    type: String, 
    required: true 
  },
  companyName: {
    type: String,
    required: true,
    default: "Assigned Industry Partner"
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  hoursWorked: { 
    type: Number, 
    required: true,
    min: 1,
    max: 12
  },
  taskDescription: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    // ✅ CHANGED THIS FROM "Approved" TO "Pending"
    default: "Pending" 
  }
}, {
  timestamps: true
});

const Logbook = mongoose.model("Logbook", logbookSchema);
export default Logbook;