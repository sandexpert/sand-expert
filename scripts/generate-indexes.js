const fs = require('fs');
const path = require('path');

const collections = [
    {
        // المجلد الذي يحتوي على ملفات المقالات المنفصلة
        dir: 'data/destinations', 
        // ملف الفهرس النهائي (حسب طلبك)
        output: 'data/destinations_index.json', 
        fields: ['title', 'image']
    },
    {
        dir: 'data/upcomingTrips',
        output: 'data/upcomingTrips_index.json',
        fields: ['title', 'image', 'date', 'pricePerDay']
    }
];

collections.forEach(collection => {
    const directoryPath = path.join(process.cwd(), collection.dir);
    
    if (!fs.existsSync(directoryPath)) {
        console.warn(`⚠️ Folder not found: ${collection.dir}`);
        return;
    }

    const files = fs.readdirSync(directoryPath);
    
    const indexData = files
        .filter(file => file.endsWith('.json') && !file.includes('_index'))
        .map(file => {
            try {
                const filePath = path.join(directoryPath, file);
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                return {
                    id: file.replace('.json', ''),
                    ...Object.fromEntries(collection.fields.map(f => [f, content[f]]))
                };
            } catch (e) {
                return null;
            }
        })
        .filter(entry => entry !== null);

    fs.writeFileSync(collection.output, JSON.stringify(indexData, null, 2));
    console.log(`✅ Success: Generated ${collection.output}`);
});
