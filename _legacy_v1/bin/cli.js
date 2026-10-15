#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lintTypeScript } from '../dist/linter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to recursively list TS files
function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && !file.startsWith('.')) {
        getFilesRecursively(filePath, fileList);
      }
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function run() {
  const args = process.argv.slice(2);
  let targetDir = '.';
  
  if (args.length > 0) {
    targetDir = args[0];
  }

  const absoluteTarget = path.resolve(targetDir);
  
  if (!fs.existsSync(absoluteTarget)) {
    console.error(`Error: Path "${targetDir}" does not exist.`);
    process.exit(1);
  }

  let filesToLint = [];
  if (fs.statSync(absoluteTarget).isDirectory()) {
    filesToLint = getFilesRecursively(absoluteTarget);
  } else if (absoluteTarget.endsWith('.ts')) {
    filesToLint = [absoluteTarget];
  }

  if (filesToLint.length === 0) {
    console.log('No TypeScript files found to lint.');
    process.exit(0);
  }

  console.log(`tsalum: Linting ${filesToLint.length} files in ${targetDir}...\n`);
  
  let totalErrors = 0;
  
  for (const file of filesToLint) {
    const code = fs.readFileSync(file, 'utf-8');
    const diagnostics = lintTypeScript(code);
    
    if (diagnostics.length > 0) {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`\x1b[4m${relativePath}\x1b[0m`);
      
      for (const diag of diagnostics) {
        console.log(`  \x1b[31mError\x1b[0m: ${diag.message}`);
        console.log(`    at line ${diag.line}, col ${diag.character}`);
        if (diag.snippet) {
          console.log(`    \x1b[90m> ${diag.snippet.trim()}\x1b[0m`);
        }
        console.log();
      }
      totalErrors += diagnostics.length;
    }
  }

  if (totalErrors > 0) {
    console.log(`🛑 Audit failed: Detected ${totalErrors} Object Calisthenics violations.`);
    process.exit(1);
  } else {
    console.log('✨ Success: Code complies perfectly with tsalum constraints.');
    process.exit(0);
  }
}

run();
