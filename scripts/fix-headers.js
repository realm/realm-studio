const fs = require('fs');
const { resolve, extname } = require('path');

const EXTENSIONS_WITH_HEADERS = ['.ts', '.tsx'];

function readHeader() {
  const headerPath = resolve(__dirname, 'header.txt');
  const header = fs.readFileSync(headerPath, 'utf8');
  // Split up the header to identify the first and last lines
  const lines = header.trim().split('\n');
  const firstLine = lines[0];
  const lastLine = lines[lines.length - 1];
  return {
    lines,
    firstLine,
    lastLine,
  };
}

const header = readHeader();

function processDirectory(path) {
  const subPaths = fs.readdirSync(path);
  for (const subPath of subPaths) {
    const absoluteSubPath = resolve(path, subPath);
    const stat = fs.statSync(absoluteSubPath);
    if (stat.isDirectory()) {
      processDirectory(absoluteSubPath);
    } else if (stat.isFile()) {
      processFile(absoluteSubPath);
    }
  }
}

function processFile(path) {
  const extension = extname(path);
  if (EXTENSIONS_WITH_HEADERS.indexOf(extension) > -1) {
    const contents = fs.readFileSync(path, 'utf8');
    const newContents = processFileContents(contents);
    fs.writeFileSync(path, newContents);
  }
}

function processFileContents(contents) {
  const lines = contents.split('\n');
  const headerLines = locateHeader(lines);
  if (headerLines.start === -1 || headerLines.end === -1) {
    // Prepend the header to the file contents
    return [...header.lines, '', ...lines].join('\n');
  } else {
    // Modify the lines to add the latest header
    lines.splice(
      headerLines.start,
      headerLines.end + 1,
      ...header.lines
    ).join('\n');
    // Return the new lines
    return lines.join('\n');
  }
}

function locateHeader(lines) {
  return {
    start: lines.indexOf(header.firstLine),
    end: lines.lastIndexOf(header.lastLine),
  };
}

if(process.argv.length === 2) {
  const srcPath = resolve(__dirname, '../src');
  processDirectory(srcPath);
} else {
  // The script was asked to run on specific file(s)
  const [_node, _script, ...paths] = process.argv;
  for (const path of paths) {
    processFile(path);
  }
}
