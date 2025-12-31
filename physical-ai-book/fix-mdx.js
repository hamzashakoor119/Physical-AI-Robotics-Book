const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');

function fixMdxBraces(content) {
    // Split by code blocks to preserve them
    const codeBlockRegex = /(```[\s\S]*?```|`[^`]+`)/g;
    const parts = content.split(codeBlockRegex);

    return parts.map((part) => {
        if (part.startsWith('`')) {
            return part;
        }
        // Escape { and } outside code blocks
        // Also escape < followed by number (like <50ms)
        return part
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/<(\d)/g, '&lt;$1');
    }).join('');
}

const files = ['01-introduction.md', '02-sensors.md', '03-actuators.md', '04-control-systems.md', '05-ros2-fundamentals.md', 'ch6-digital-twin-gazebo-unity.md'];

files.forEach(fname => {
    const fpath = path.join(docsDir, fname);
    if (fs.existsSync(fpath)) {
        let content = fs.readFileSync(fpath, 'utf8');

        // Handle frontmatter separately
        if (content.startsWith('---')) {
            const endOfFrontmatter = content.indexOf('---', 3);
            if (endOfFrontmatter !== -1) {
                const frontmatter = content.substring(0, endOfFrontmatter + 3);
                const body = content.substring(endOfFrontmatter + 3);
                content = frontmatter + fixMdxBraces(body);
            }
        } else {
            content = fixMdxBraces(content);
        }

        fs.writeFileSync(fpath, content);
        console.log('Fixed ' + fname);
    }
});

console.log('Done!');
