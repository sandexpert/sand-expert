const fs = require('fs');
const path = require('path');

// تعريف المجلدات التي سنقوم بمسحها
const collections = [
    {
        dir: 'data/destinations',
        output: 'data/destinations_index.json',
        fields: ['title', 'image'] // الحقول التي نريدها في الفهرس
    },
    {
        dir: 'data/upcomingTrips',
        output: 'data/upcomingTrips_index.json',
        fields: ['title', 'image', 'date', 'pricePerDay']
    }
];

collections.forEach(collection => {
    const directoryPath = path.join(process.cwd(), collection.dir);
    
    // قراءة كل الملفات في المجلد
    const files = fs.readdirSync(directoryPath);
    
    const indexData = files
        .filter(file => file.endsWith('.json') && file !== 'index.json')
        .map(file => {
            const filePath = path.join(directoryPath, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // استخراج الحقول المطلوبة + اسم الملف كـ ID
            const entry = {
                id: file.replace('.json', '')
            };
            
            collection.fields.forEach(field => {
                if (content[field] !== undefined) {
                    entry[field] = content[field];
                }
            });
            
            return entry;
        });

    // كتابة ملف index.json الجديد
    fs.writeFileSync(collection.output, JSON.stringify(indexData, null, 2));
    console.log(`✅ Updated index for: ${collection.dir}`);
});
