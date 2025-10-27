import { json } from "express";
import Resume from "../models/resume.js";
import imageKit from "../configs/imageKit.js";
import fs from "fs";

// controller for creating a new resume
// POST /api/resume/create
export const createResume = async (req, res) => {
  try {
    const userID = req.userId;
    const { title } = req.body;

    // create new resume
    const newResume = await Resume.create({ userID, title });
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
// POST /api/resume/delete
export const deleteResume = async (req, res) => {
  try {
    const userID = req.userId;
    const { resumeID } = req.params;

    await Resume.findOneAndDelete({ userID, _id: resumeID });
    // return success message
    return res.status(201).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get user resume by id
// GET: /api/resume/get
export const getResumeById = async (req, res) => {
  try {
    const userID = req.userId;
    const { resumeID } = req.params;

    const resume = await Resume.findOne({ userID, _id: resumeID });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    // return success message
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(201).json({ resume });
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

    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for updating resume
// POST /api/resume/update
export const updateResume = async (req, res) => {
  try {
    const userID = req.userId;
    const { resumeID, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = JSON.parse(resumeData);

   

    if (image) {
         const imageBufferData =  fs.createReadStream(image.path);

        const response = await imageKit.files.upload({
            file: imageBufferData,
            fileName: 'resume.png',
            folder: 'user-resume',
            transformation: {
                pre: 'w-300, h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')

            }

          
    })
      resumeDataCopy.personal_info.image=  response.url;

    }

    const resume = await Resume.findOneAndUpdate(
      { userID, _id: resumeID },
      resumeDataCopy,
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Saved successfully", resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
