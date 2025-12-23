const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.error('Usage: node reconstruct_single.js <input_b64_file> <output_png_path>');
    process.exit(1);
}

try {
    let b64 = fs.readFileSync(inputPath, 'utf8').trim();
    if (b64.startsWith('data:image/png;base64,')) {
        b64 = b64.replace('data:image/png;base64,', '');
    }
    // Remove any potential whitespace or newlines that might have sneaked into the manual assembly
    b64 = b64.replace(/\s/g, '');

    const buffer = Buffer.from(b64, 'base64');

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully saved to ${outputPath}`);
} catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
}
