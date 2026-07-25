import * as fs from 'fs';
import * as path from 'path';

console.log('🔍 Starting Design Harness Validation...');

const contractsDir = path.resolve(__dirname, '../contracts');

function validateJsonFiles(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      validateJsonFiles(fullPath);
    } else if (file.name.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        JSON.parse(content);
        console.log(`✅ [Pass] ${path.relative(contractsDir, fullPath)} is a valid JSON.`);
      } catch (err: any) {
        console.error(`❌ [Fail] ${path.relative(contractsDir, fullPath)}: ${err.message}`);
        process.exit(1);
      }
    }
  }
}

try {
  validateJsonFiles(contractsDir);
  console.log('🎉 All contracts are valid JSON!');
} catch (error) {
  console.error('Validation failed:', error);
  process.exit(1);
}
