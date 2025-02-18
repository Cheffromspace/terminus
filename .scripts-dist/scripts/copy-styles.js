import fs from 'fs';
import path from 'path';
const sourceDir = path.join(process.cwd(), 'src/styles');
const targetDir = path.join(process.cwd(), 'public/styles');
// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}
// Copy CSS files
const cssFiles = ['components.css', 'markdown.css'];
cssFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file} to public/styles/`);
});
// Process critical CSS
const criticalCssPath = path.join(sourceDir, 'critical.css');
const criticalCss = fs.readFileSync(criticalCssPath, 'utf-8');
// Create a module that exports the critical CSS
const moduleContent = `export const criticalCSS = \`${criticalCss.replace(/`/g, '\\`')}\`;\n`;
fs.writeFileSync(path.join(sourceDir, 'critical-css.ts'), moduleContent);
console.log('Generated critical CSS module');
