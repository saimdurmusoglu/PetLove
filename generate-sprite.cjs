const fs = require('fs');
const path = require('path');

const iconsDir = './public/icons';
const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));

const keepWhiteIcons = ['icon-burger-white', 'icon-female-white', 'icon-male-white', 'icon-other-white'];

let symbols = '';
files.forEach(file => {
  const name = file.replace('.svg', '');
  let content = fs.readFileSync(path.join(iconsDir, file), 'utf8');
  content = content
    .replace(/<svg([^>]*)>/, `<symbol id="${name}" $1>`)
    .replace('</svg>', '</symbol>');

  if (!keepWhiteIcons.includes(name)) {
    content = content
      .replace(/stroke="#[0-9a-fA-F]{3,6}"/g, 'stroke="currentColor"')
      .replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="currentColor"');
  }

  symbols += content + '\n';
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}</svg>`;

if (!fs.existsSync('./public/sprite')) {
  fs.mkdirSync('./public/sprite', { recursive: true });
}

fs.writeFileSync('./public/sprite/sprite.svg', sprite);
console.log('Sprite created!');