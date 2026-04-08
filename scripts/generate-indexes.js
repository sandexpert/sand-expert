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

collections.forEach(collection => {
    const directoryPath = path.join(process.cwd(), collection.dir);
    
    console.log(`🔍 Checking directory: ${directoryPath}`);

    // التأكد من وجود المجلد، إذا لم يوجد ننشئ مصفوفة فارغة ونستمر
    if (!fs.existsSync(directoryPath)) {
        console.warn(`⚠️ Warning: Directory ${collection.dir} not found. Creating empty index.`);
        fs.writeFileSync(path.join(process.cwd(), collection.output), JSON.stringify([], null, 2));
        return;
    }

    try {
        const files = fs.readdirSync(directoryPath);
        const indexData = files
            .filter(file => file.endsWith('.json') && !file.includes('_index'))
            .map(file => {
                try {
                    const filePath = path.join(directoryPath, file);
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    
                    const entry = { id: file.replace('.json', '') };
                    collection.fields.forEach(f => {
                        entry[f] = content[f] || ""; // ضمان عدم وجود قيم undefined
                    });
                    return entry;
                } catch (e) {
                    console.error(`❌ Error parsing file ${file}:`, e.message);
                    return null;
                }
            })
            .filter(entry => entry !== null);

        fs.writeFileSync(path.join(process.cwd(), collection.output), JSON.stringify(indexData, null, 2));
        console.log(`✅ Successfully generated: ${collection.output}`);
    } catch (err) {
        console.error(`❌ Fatal error in ${collection.dir}:`, err.message);
    }
});
