import { Request, Response } from "express";
import { TextractServices } from "../../../services/aws";
import fs from "fs";
import multer from "multer";
import path from "path";
import { CustomError } from "../../../utils";

const UPLOADS_DIR = "uploads";

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_, _file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new CustomError("Only image and PDF files are allowed", 400));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("photo");

export const verifyIdentityHandler = async (req: Request, res: Response) => {
  await new Promise<void>((resolve, reject) => {
    upload(req, res, (err: unknown) => {
      if (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        return reject(e instanceof CustomError ? e : new CustomError(e.message, 400));
      }
      resolve();
    });
  });

  if (!req.file) throw new CustomError("A file is required", 400);

  const filePath = req.file.path;
  try {
    const result = await TextractServices.scanDocument(filePath);
    res.status(200).json({ message: "File processed successfully", result });
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
