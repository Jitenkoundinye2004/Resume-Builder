import Resume from "../models/resume.js";
import imageKit from "../configs/imageKit.js";
import fs from "fs";
import mongoose from "mongoose";

// controller for creating a new resume
// POST /api/resume/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    // create new resume
    const newResume = await Resume.create({ userId, title });
    // return success message
    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for deleting resume
// DELETE /api/resume/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deletedResume = await Resume.findOneAndDelete({ userId, _id: resumeId });
    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    // return success message
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get user resume by id
// GET: /api/resume/get/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    // return success message
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get user resume by id public
// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
  try {
    // Log all request details for debugging
    console.log('=== getPublicResumeById called ===');
    console.log('req.params:', req.params);
    console.log('req.path:', req.path);
    console.log('req.url:', req.url);
    console.log('req.originalUrl:', req.originalUrl);
    console.log('req.method:', req.method);
    
    const { resumeId } = req.params;
    // Remove any trailing slashes or whitespace
    const cleanResumeId = resumeId?.trim().replace(/\/$/, '');
    
    console.log('=== Public Resume Request ===');
    console.log('Original Resume ID:', resumeId);
    console.log('Cleaned Resume ID:', cleanResumeId);
    console.log('Request Path:', req.path);
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    
    // Check if resumeId exists
    if (!cleanResumeId) {
      console.log('ERROR: No resume ID provided');
      return res.status(400).json({ message: "Resume ID is required" });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(cleanResumeId)) {
      console.log('ERROR: Invalid ObjectId format:', cleanResumeId);
      return res.status(400).json({ 
        message: "Invalid resume ID format",
        providedId: cleanResumeId 
      });
    }

    console.log('Querying database for resume:', cleanResumeId);
    const resume = await Resume.findOne({ _id: cleanResumeId });
    
    if (!resume) {
      console.log('ERROR: Resume not found in database:', cleanResumeId);
      return res.status(404).json({ 
        message: "Resume not found",
        resumeId: cleanResumeId 
      });
    }

    console.log('Resume found:', cleanResumeId);
    console.log('Resume title:', resume.title);
    console.log('Resume public status:', resume.public);
    
    // Check if resume is public (optional - remove if you want all resumes accessible)
    // if (resume.public !== true) {
    //   console.log('ERROR: Resume is not public:', cleanResumeId);
    //   return res.status(403).json({ 
    //     message: "This resume is not publicly accessible",
    //     resumeId: cleanResumeId 
    //   });
    // }

    console.log('SUCCESS: Returning public resume:', cleanResumeId);
    return res.status(200).json({ resume });
  } catch (error) {
    console.error("ERROR: Exception in getPublicResumeById:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: "An error occurred while fetching the resume",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Controller for updating a resume
export const updateResume = async (req, res) => {
  const userId = req.userId;
  const { resumeId, resumeData, removeBackground } = req.body;
  const image = req.file; // This is populated by Multer

  try {
    // Fetch the existing resume to get current image
    const existingResume = await Resume.findOne({ userId, _id: resumeId });
    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      // Use structuredClone for a deep copy if available (Node.js v17+)
      // Otherwise, a simple spread might suffice if your object isn't deeply nested
      resumeDataCopy = structuredClone(resumeData);
    }

    // Ensure personal_info exists
    if (!resumeDataCopy.personal_info) {
      resumeDataCopy.personal_info = {};
    }

    // Handle image upload if a file is present
    if (image) {
      try {
        // Check if ImageKit is properly configured
        if (process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_PRIVATE_KEY !== 'dummy_private_key') {
          const result = await imageKit.upload({
            file: fs.readFileSync(image.path),
            fileName: `resume_${userId}_${Date.now()}.jpg`,
            folder: '/resumes',
          });
          resumeDataCopy.personal_info.image = result.url;
          console.log("Image uploaded successfully:", result.url);
        } else {
          console.log("ImageKit not configured, keeping existing image");
          resumeDataCopy.personal_info.image = existingResume.personal_info.image || '';
        }
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError.message);
        // Keep existing image on upload failure
        resumeDataCopy.personal_info.image = existingResume.personal_info.image || '';
      } finally {
        // **Crucial Step**: Clean up the temporary file from your server
        fs.unlink(image.path, (err) => {
          if (err) console.error("Error deleting temporary file:", err);
        });
      }
    } else {
      // No new image file, keep the image from resumeData if it exists, otherwise keep existing
      if (!resumeDataCopy.personal_info.image) {
        resumeDataCopy.personal_info.image = existingResume.personal_info.image || '';
      }
      // If resumeDataCopy.personal_info.image is already set (as a string URL), keep it
    }

    // Update the resume in the database
    const { _id, ...updateData } = resumeDataCopy;
    const updateObj = {};
    Object.keys(updateData).forEach(key => {
      if (key === 'personal_info') {
        Object.keys(updateData.personal_info).forEach(subKey => {
          updateObj[`personal_info.${subKey}`] = updateData.personal_info[subKey];
        });
      } else {
        updateObj[key] = updateData[key];
      }
    });
    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: updateObj },
      { new: true } // Return the updated document
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log("Resume updated successfully in DB.");
    return res.status(200).json({ message: "Saved successfully", resume: updatedResume });

  } catch (error) {
    console.error("Error updating resume:", error.message);
    // If an image was part of the failed request, ensure it's cleaned up
    if (image) {
      fs.unlink(image.path, (err) => {
        if (err) console.error("Error deleting temp file after main error:", err);
      });
    }
    return res.status(500).json({ message: "An internal server error occurred." });
  }
};
