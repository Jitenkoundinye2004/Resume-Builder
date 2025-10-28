import { json } from "express";
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
// GET: /api/resume/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeID } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeID });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// controller for updating resume
// PUT /api/resume/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    console.log("Update request received:", { userId, resumeId, hasImage: !!image, resumeDataKeys: Object.keys(resumeData || {}) });

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // Handle image upload separately to avoid failing the entire save
    if (image) {
      try {
        console.log("Uploading image:", image.originalname, image.size);
        const imageBufferData = fs.createReadStream(image.path);

        const response = await imageKit.files.upload({
          file: imageBufferData,
          fileName: `resume_${Date.now()}.png`,
          folder: "user-resume",
          transformation: {
            pre:
              "w-300, h-300,fo-face,z-0.75" +
              (removeBackground ? ",e-bgremove" : ""),
          },
        });
        console.log("Image uploaded successfully:", response.url);
        resumeDataCopy.personal_info.image = response.url;
      } catch (error) {
        console.error("Image upload failed:", error.message);
        // Continue saving resume without updating image
      }
    }

    console.log("Updating resume in DB:", resumeDataCopy);
    const { _id, ...updateData } = resumeDataCopy;
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: updateData },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log("Resume updated successfully");
    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (error) {
    console.error("Error updating resume:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
