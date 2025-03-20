const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
if (!fs.existsSync('./icons')) {
    fs.mkdirSync('./icons');
}

// Generate icons for each size
sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(0, 0, size, size);

    // Music note
    ctx.fillStyle = '#ffffff';
    ctx.font = `${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♪', size / 2, size / 2);

    // Save the icon
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./icons/icon-${size}x${size}.png`, buffer);
});

console.log('Icons generated successfully!');
