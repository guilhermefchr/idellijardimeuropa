const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// replace extensions to .webp
html = html.replace(/\.png/gi, '.webp')
    .replace(/\.jpeg/gi, '.webp')
    .replace(/\.jpg/gi, '.webp');

// Add lazy loading to images (excluding the header logo and hero images)
html = html.replace(/<img(.*?)>/g, (match, p1) => {
    if (p1.includes('loading="lazy"')) return match;

    // Check if it's the hero image
    if (p1.includes('class="hero-img-desktop"') || p1.includes('class="hero-img-mobile"')) {
        return `<img${p1} fetchpriority="high" decoding="sync">`;
    }

    // Return lazy loaded image
    if (!p1.includes('loading=')) {
        return `<img${p1} loading="lazy" decoding="async">`;
    }

    return match;
});

// Add DNS prefetch and Preconnect to head for fonts/clarity if missing
if (!html.includes('rel="preconnect" href="https://fonts.gstatic.com"')) {
    html = html.replace('</head>', `    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n</head>`);
}

fs.writeFileSync('index.html', html);
console.log('HTML Optimized');
