const fs = require('fs');
const path = require('path');

const iconsDir = './src/assets/icons';
const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));

let symbols = '';
files.forEach(file => {
  const name = file.replace('.svg', '');
  let content = fs.readFileSync(path.join(iconsDir, file), 'utf8');
  content = content
    .replace(/<svg([^>]*)>/, `<symbol id="${name}" $1>`)
    .replace('</svg>', '</symbol>');
  symbols += content + '\n';
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}</svg>`;
fs.writeFileSync('./src/assets/sprite/sprite.svg', sprite);
console.log('Sprite created!');