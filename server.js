import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn(">>> WARNING: Cloudinary credentials missing. File uploads will not work.");
}

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI;
console.log(">>> [INIT] Checking MONGODB_URI...");
if (MONGODB_URI) {
    console.log(">>> [INIT] MONGODB_URI found! Attempting connection...");
    mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000
    })
        .then(() => {
            console.log(">>> [INIT] SUCCESS: Connected to MongoDB Atlas");
            migrateDataIfNeeded();
        })
        .catch(err => {
            console.error(">>> [INIT] ERROR: MongoDB Connection Failed:", err.message);
            console.error(">>> [INIT] Full error:", err);
        });
} else {
    console.error(">>> [INIT] CRITICAL WARNING: MONGODB_URI is MISSING from environment variables!");
    console.warn(">>> [INIT] Falling back to ephemeral db.json. DATA WILL BE LOST ON RESTART.");
}

// --- MongoDB Schema ---
const DataSchema = new mongoose.Schema({
    id: { type: String, default: 'app_state' },
    config: Object,
    courses: Array,
    teachers: Array,
    achievements: Array,
    messages: Array,
    categories: Array,
    publicDocuments: Array
}, { timestamps: true });

const DataModel = mongoose.model('Data', DataSchema);

// Migration Helper
async function migrateDataIfNeeded() {
    try {
        const count = await DataModel.countDocuments();
        if (count === 0 && fs.existsSync(DB_FILE)) {
            console.log(">>> Seeding MongoDB with data from db.json...");
            const localData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
            await DataModel.create({ ...localData, id: 'app_state' });
            console.log(">>> Migration Successful!");
        }
    } catch (err) {
        console.error(">>> Migration Error:", err);
    }
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
app.get('/api/data', async (req, res) => {
    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
        try {
            const data = await DataModel.findOne({ id: 'app_state' });
            if (data) {
                return res.json({ ...data.toObject(), _storage: 'mongodb' });
            }
            console.log(">>> MongoDB is empty, falling back to db.json for initial seed.");
        } catch (err) {
            console.error('Error reading MongoDB:', err);
        }
    }

    // 2. Fallback to local db.json
    const data = readDB();
    console.log(">>> [GET] Served data from db.json (Fallback)");
    res.json({ ...data, _storage: 'file' });
});

app.get('/api/status', (req, res) => {
    res.json({
        mongodb_uri_exists: !!process.env.MONGODB_URI,
        mongodb_connection_state: mongoose.connection.readyState,
        mongodb_state_desc: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
        cloudinary_configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
        server_uptime: process.uptime(),
        env: process.env.NODE_ENV || 'development'
    });
});

app.post('/api/data', async (req, res) => {
    // 1. Mandatory MongoDB if URI is present
    if (process.env.MONGODB_URI) {
        if (mongoose.connection.readyState === 1) {
            try {
                await DataModel.findOneAndUpdate(
                    { id: 'app_state' },
                    { $set: req.body },
                    { upsert: true, new: true }
                );
                console.log(">>> [STORAGE] Data saved to MongoDB Atlas");
                return res.json({ success: true, storage: 'mongodb' });
            } catch (err) {
                console.error('>>> [STORAGE] FAILED to save to MongoDB:', err);
                return res.status(503).json({
                    error: 'Cloud storage connection error. Data NOT saved.',
                    details: err.message
                });
            }
        } else {
            console.error(">>> [STORAGE] MongoDB not ready (readyState: " + mongoose.connection.readyState + ")");
            return res.status(503).json({
                error: 'Database connection is warming up. Please try again in 5 seconds.'
            });
        }
    }

    // 2. Local development fallback (non-production)
    console.log(">>> [STORAGE] Falling back to local db.json (No MONGODB_URI detected)");
    const success = writeDB(req.body);
    if (success) {
        res.json({ success: true, storage: 'file' });
    } else {
        res.status(500).json({ error: 'Failed to write to local storage' });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'binhminh_uploads', access_mode: 'public' },
        (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ url: result.secure_url });
        }
    );
    stream.end(req.file.buffer);
});

app.post('/api/upload-pdf', uploadPdf.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const originalName = req.file.originalname;
    const nameWithoutExt = path.parse(originalName).name;

    // Sanitize filename for a clean URL
    const sanitizedName = nameWithoutExt
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .slice(0, 50);

    const publicId = `${sanitizedName}_${Date.now()}`;

    const stream = cloudinary.uploader.upload_stream(
        {
            folder: 'binhminh_pdfs',
            resource_type: 'image', // Best for browser viewing
            public_id: publicId,
            format: 'pdf'
        },
        (error, result) => {
            if (error) {
                console.error('Cloudinary PDF Upload Error:', error);
                return res.status(500).json({ error: error.message });
            }

            // Ensure URL ends in .pdf for browser compatibility
            let finalUrl = result.secure_url;
            if (!finalUrl.toLowerCase().endsWith('.pdf')) {
                finalUrl += '.pdf';
            }
            res.json({ url: finalUrl });
        }
    );
    stream.end(req.file.buffer);
});

app.delete('/api/delete-file', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        if (url.includes('cloudinary.com')) {
            // Robust extraction of public_id and folder
            // URL format: .../upload/v12345/folder/id.ext or .../upload/folder/id.ext
            const urlParts = url.split('/');
            const filenameWithExt = urlParts.pop();
            const publicId = filenameWithExt.split('.')[0];

            const uploadIndex = urlParts.indexOf('upload');
            let folderParts = [];
            if (uploadIndex !== -1) {
                // Skip 'upload' and potentially 'v12345'
                let startIndex = uploadIndex + 1;
                if (urlParts[startIndex] && urlParts[startIndex].startsWith('v')) {
                    startIndex++;
                }
                folderParts = urlParts.slice(startIndex);
            }

            const fullPublicId = folderParts.length > 0 ? `${folderParts.join('/')}/${publicId}` : publicId;
            console.log('Attempting to delete Cloudinary resource:', fullPublicId);

            // Try all possible resource types to be safe
            for (const rType of ['image', 'raw', 'video']) {
                try {
                    await cloudinary.uploader.destroy(fullPublicId, { resource_type: rType });
                } catch (e) {
                    console.warn(`Skip ${rType} delete for ${fullPublicId}:`, e.message);
                }
            }
            return res.json({ success: true });
        }

        // Fallback for local files
        try {
            const urlPath = url.startsWith('http') ? new URL(url).pathname : url;
            const filename = path.basename(urlPath);
            const isPdf = urlPath.includes('/pdfs/');
            const filePath = path.join(__dirname, 'public', isPdf ? 'pdfs' : 'uploads', filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error('Local file delete skip:', err.message);
        }

        res.json({ success: true });
    } catch (err) {
        console.error('API delete-file error:', err);
        res.json({ success: true, warning: err.message }); // Always return success to UI to avoid blocking
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
