import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.post("/convert", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const inputPath = req.file.path;
  const outputDir = path.resolve("uploads");
  const libreOfficePath = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;
  const outputPdf = path.join(
    outputDir,
    `${path.basename(inputPath, path.extname(inputPath))}.pdf`
  );

  console.log(`Received: ${req.file.originalname}`);
  console.log("Converting with LibreOffice...");

  const command = `${libreOfficePath} --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

  exec(command, (error) => {
    if (error) {
      console.error(" Conversion error:", error.message);
      return res.status(500).send("Conversion failed. Check LibreOffice path.");
    }

    // Check that PDF exists before sending
    if (!fs.existsSync(outputPdf)) {
      console.error(" Output PDF not found:", outputPdf);
      return res.status(500).send("PDF not generated.");
    }

    console.log(" Conversion successful:", outputPdf);

    // Send file for browser download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");

    const fileStream = fs.createReadStream(outputPdf);
    fileStream.pipe(res);

    // Optional: clean up temporary files
    fileStream.on("close", () => {
      fs.unlink(inputPath, () => {});
      fs.unlink(outputPdf, () => {});
      console.log("Temporary files removed.");
    });
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on: http://localhost:5000");
});
