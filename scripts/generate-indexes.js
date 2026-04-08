const fs = require('fs');
const path = require('path');

const collections = [
    {
        dir: 'data',
        output: 'data/destinations_index.json',
        fields: ['title', 'image']
    },
    {
        dir: 'data',
        output: 'data/upcomingTrips_index.json',
        fields: ['title', 'image', 'date', 'pricePerDay']
    }
];

collections.forEach(collection => {
    const directoryPath = path.join(process.cwd(), collection.dir);
    
    // فحص أمان: إذا كان المجلد غير موجود، قم بإنشائه أو تخطيه بدلاً من التعطل
    if (!fs.existsSync(directoryPath)) {
        console.warn(`⚠️ Folder not found: ${collection.dir}. Skipping...`);
        // إنشاء المجلد إذا أردت ذلك
        fs.mkdirSync(directoryPath, { recursive: true });
        fs.writeFileSync(collection.output, JSON.stringify([], null, 2));
        return;
    }

    const files = fs.readdirSync(directoryPath);
    
    const indexData = files
        .filter(file => file.endsWith('.json') && file !== 'index.json')
        .map(file => {
            try {
                const filePath = path.join(directoryPath, file);
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const entry = { id: file.replace('.json', '') };
                
                collection.fields.forEach(field => {
                    if (content[field] !== undefined) entry[field] = content[field];
                });
                return entry;
            } catch (e) {
                console.error(`❌ Error parsing ${file}:`, e);
                return null;
            }
        })
        .filter(entry => entry !== null); // إزالة أي ملفات تالفة

    fs.writeFileSync(collection.output, JSON.stringify(indexData, null, 2));
    console.log(`✅ Updated index for: ${collection.dir}`);
});
