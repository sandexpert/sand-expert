const fs = require('fs');
const path = require('path');

const collections = [
    {
        dir: 'data/destinations',
        output: 'data/destinations_index.json',
        fields: ['title', 'image']
    },
    {
        dir: 'data/upcomingTrips',
        output: 'data/upcomingTrips_index.json',
        fields: ['title', 'image', 'date', 'pricePerDay']
    }
];

// --- 1. تحديث فهارس المقالات والرحلات ---
collections.forEach(collection => {
    const directoryPath = path.join(process.cwd(), collection.dir);
    if (fs.existsSync(directoryPath)) {
        const files = fs.readdirSync(directoryPath);
        const indexData = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(directoryPath, file), 'utf8'));
                    return { id: file.replace('.json', ''), ...Object.fromEntries(collection.fields.map(f => [f, content[f]])) };
                } catch (e) { return null; }
            }).filter(entry => entry !== null);
        fs.writeFileSync(path.join(process.cwd(), collection.output), JSON.stringify(indexData, null, 2));
        console.log(`✅ Updated: ${collection.output}`);
    }
});

// --- 2. تحديث معرض الصور (Gallery) ---
// --- تحديث معرض الصور (Gallery) - مصفوفة بسيطة وبدون ترتيب ---
const galleryDir = 'assets/gallery_img';
const galleryOutput = 'data/galleryData.json';
const galleryPath = path.join(process.cwd(), galleryDir);

if (fs.existsSync(galleryPath)) {
    const images = fs.readdirSync(galleryPath)
        .filter(file => /\.(webp|jpg|jpeg|png|gif)$/i.test(file)) // تصفية الصور فقط
        .map(file => `${galleryDir}/${file}`); // تحويل اسم الملف مباشرة إلى مسار نصي

    fs.writeFileSync(path.join(process.cwd(), galleryOutput), JSON.stringify(images, null, 2));
    console.log(`✅ Updated Gallery (Simple & Raw): ${galleryOutput}`);
}
