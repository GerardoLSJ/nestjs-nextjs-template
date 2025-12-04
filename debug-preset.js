const fs = require('fs');
const path = require('path');

const presetPath = path.resolve(__dirname, 'jest.preset.js');
console.log('Expected preset path:', presetPath);
console.log('Exists:', fs.existsSync(presetPath));

try {
    require.resolve('@nx/jest/preset');
    console.log('@nx/jest/preset resolves');
} catch (e) {
    console.log('@nx/jest/preset DOES NOT resolve');
}
