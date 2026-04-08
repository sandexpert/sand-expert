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
const galleryDir = 'assets/gallery_img';
const galleryOutput = 'data/galleryData.json';
const galleryPath = path.join(process.cwd(), galleryDir);

if (fs.existsSync(galleryPath)) {
    const images = fs.readdirSync(galleryPath)
        .filter(file => /\.(webp|jpg|jpeg|png|gif)$/i.test(file)) // دعم كافة الصيغ
        .map(file => {
            const stats = fs.statSync(path.join(galleryPath, file));
            return {
                id: path.parse(file).name, // استخدام اسم الملف كـ ID
                url: `${galleryDir}/${file}`,
                uploadDate: stats.mtime.toISOString() // تاريخ آخر تعديل للملف
            };
        })
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)); // الأحدث أولاً

    fs.writeFileSync(path.join(process.cwd(), galleryOutput), JSON.stringify(images, null, 2));
    console.log(`✅ Updated Gallery: ${galleryOutput}`);
}
