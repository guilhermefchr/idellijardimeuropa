const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'Assets/Imagens Idélli');

async function optimizeFolder(folder) {
    const files = fs.readdirSync(folder, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(folder, file.name);
        if (file.isDirectory()) {
            await optimizeFolder(fullPath);
        } else if (/\.(png|jpe?g)$/i.test(file.name)) {
            const webpPath = fullPath.replace(/\.(png|jpe?g)$/i, '.webp');
            if (fs.existsSync(webpPath)) {
                console.log(`Skipping: ${file.name} (Already optimized)`);
                continue;
            }

            console.log(`Optimizing: ${file.name}`);
            try {
                const image = sharp(fullPath);
                const metadata = await image.metadata();

                let transform = image;
                if (metadata.width > 2000) {
                    transform = transform.resize({ width: 2000, withoutEnlargement: true });
                }

                await transform.webp({ quality: 80 }).toFile(webpPath);
            } catch (e) {
                console.error(`Failed to optimize ${file.name}:`, e);
            }
        }
    }
}

optimizeFolder(dir).then(() => {
    console.log('All images optimized');
});
