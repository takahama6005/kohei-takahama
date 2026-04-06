const fs = require('fs');
const https = require('https');
https.get('https://note.com/kouhei6050', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        const match = rawData.match(/<meta property="og:image" content="([^"]+)"/i);
        fs.writeFileSync('imgs.txt', "NOTE_IMG=" + (match ? match[1] : "") + "\n", {flag: 'a'});
    });
});
https.get('https://www.facebook.com/profile.php?id=100007626967881', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        const match = rawData.match(/<meta property="og:image" content="([^"]+)"/i);
        fs.writeFileSync('imgs.txt', "FB_IMG=" + (match ? match[1] : "") + "\n", {flag: 'a'});
    });
});
