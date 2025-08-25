// Quick script to fix sample configurations
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/sampleConfigurations.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace layer objects to add id property
content = content.replace(
  /{\s*name:\s*(['"][^'"]*['"])/g,
  (match, name) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return `{\n        id: 'layer-${id}',\n        name: ${name}`;
  }
);

// Add missing properties to flanking elements that don't have them
content = content.replace(
  /{(\s*elementType:\s*ElementType\.\w+,\s*thickness:\s*\d+,\s*material:\s*['"][^'"]*['"],\s*position:\s*['"][^'"]*['"])\s*}/g,
  (match, props) => {
    return `{
        id: 'flanking-${Math.random().toString(36).substr(2, 9)}',
        ${props.trim()},
        length: 4.0,
        junctionType: 'rigid',
        connectionDetails: 'Standard rigid connection'
      }`;
  }
);

fs.writeFileSync(filePath, content);
console.log('Fixed sample configurations');
