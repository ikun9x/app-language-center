import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn(">>> WARNING: Cloudinary credentials missing. File uploads will not work.");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const PDF_DIR = path.join(__dirname, 'public', 'pdfs');

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/pdfs', express.static(PDF_DIR));

// Multer configuration (using memory storage for cloud upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadPdf = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() === '.pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return null;
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading DB:', err);
        return null;
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing DB:', err);
        return false;
    }
};

// Endpoints
app.get('/api/data', (req, res) => {
    const data = readDB();
    res.json(data);
});

app.post('/api/data', (req, res) => {
    const success = writeDB(req.body);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to write data' });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'binhminh_uploads' },
        (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ url: result.secure_url });
        }
    );
    stream.end(req.file.buffer);
});

app.post('/api/upload-pdf', uploadPdf.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'binhminh_pdfs', resource_type: 'auto' },
        (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ url: result.secure_url });
        }
    );
    stream.end(req.file.buffer);
});

app.delete('/api/delete-file', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        if (url.includes('cloudinary.com')) {
            // Extract public_id for Cloudinary deletion
            // Example: https://res.cloudinary.com/djzcocm5c/image/upload/v1735031127/binhminh_uploads/z6160566373322_5174092d061c28c86d888f4e91022830_itaxsw.jpg
            const parts = url.split('/');
            const filenameWithExt = parts[parts.length - 1];
            const publicId = filenameWithExt.split('.')[0];
            const folder = url.includes('binhminh_pdfs') ? 'binhminh_pdfs' : 'binhminh_uploads';
            const fullPublicId = `${folder}/${publicId}`;

            // Try to delete as raw first (for PDFs)
            try {
                await cloudinary.uploader.destroy(fullPublicId, { resource_type: 'raw' });
            } catch (e) { }

            // Try to delete as image (for images)
            try {
                await cloudinary.uploader.destroy(fullPublicId, { resource_type: 'image' });
            } catch (e) { }

            return res.json({ success: true });
        }

        // Fallback for local files
        const filename = path.basename(url);
        let filePath = path.join(UPLOAD_DIR, filename);
        if (!fs.existsSync(filePath)) filePath = path.join(PDF_DIR, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// --- Garbage Collector ---
app.get('/api/garbage-collector', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        const usedFiles = new Set();

        // Helper to extract filename from URL or path
        const extractFilename = (str) => {
            if (!str || typeof str !== 'string') return null;
            if (str.startsWith('http')) {
                const parts = str.split('/');
                return parts[parts.length - 1];
            }
            if (str.startsWith('/uploads/') || str.startsWith('/pdfs/')) {
                return path.basename(str);
            }
            return null;
        };

        // Recurse through data to find all used files
        const findUsedFiles = (obj) => {
            if (!obj) return;
            if (typeof obj === 'string') {
                const filename = extractFilename(obj);
                if (filename) usedFiles.add(filename);
            } else if (Array.isArray(obj)) {
                obj.forEach(findUsedFiles);
            } else if (typeof obj === 'object') {
                Object.values(obj).forEach(findUsedFiles);
            }
        };

        findUsedFiles(data);

        const checkDir = (dir) => {
            if (!fs.existsSync(dir)) return [];
            return fs.readdirSync(dir).filter(file => {
                return !usedFiles.has(file) && fs.statSync(path.join(dir, file)).isFile();
            });
        };

        const junkUploads = checkDir(UPLOAD_DIR);
        const junkPdfs = checkDir(PDF_DIR);

        const allJunk = [
            ...junkUploads.map(f => ({ name: f, dir: 'uploads', path: path.join(UPLOAD_DIR, f) })),
            ...junkPdfs.map(f => ({ name: f, dir: 'pdfs', path: path.join(PDF_DIR, f) }))
        ];

        if (req.query.action === 'delete') {
            allJunk.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (e) {
                    console.error(`Failed to delete ${file.path}:`, e);
                }
            });
            return res.json({ success: true, deleted: allJunk.length, files: allJunk });
        }

        res.json({ success: true, count: allJunk.length, files: allJunk });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve static frontend in production
const DIST_PATH = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_PATH)) {
    app.use(express.static(DIST_PATH));
    app.get(/.*/, (req, res) => {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/') && !req.path.startsWith('/pdfs/')) {
            res.sendFile(path.join(DIST_PATH, 'index.html'));
        }
    });
}

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
