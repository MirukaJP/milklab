import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';

console.log('🔍 Starting Strict JSON Schema Validation...');

const ajv = new Ajv({ allErrors: true, strictTypes: false });
const contractsDir = path.resolve(__dirname, '../contracts');
const tokensDir = path.join(contractsDir, 'tokens');

// 1. Load schema
const tokenSchemaPath = path.join(contractsDir, 'tokens.schema.json');
let tokenSchema;
try {
  tokenSchema = JSON.parse(fs.readFileSync(tokenSchemaPath, 'utf8'));
} catch (error) {
  console.error(`❌ Failed to load schema: ${tokenSchemaPath}`);
  process.exit(1);
}

const validateTokens = ajv.compile(tokenSchema);
let hasError = false;

// 2. Validate token JSON files
function validateJsonFilesInDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      validateJsonFilesInDir(fullPath);
    } else if (file.name.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(content);
        
        const valid = validateTokens(data);
        if (!valid) {
          console.error(`❌ [Schema Violation] ${path.relative(contractsDir, fullPath)}`);
          console.error(ajv.errorsText(validateTokens.errors, { separator: '\n' }));
          hasError = true;
        } else {
          console.log(`✅ [Pass] ${path.relative(contractsDir, fullPath)} complies with schema.`);
        }
      } catch (err: any) {
        console.error(`❌ [Parse Error] ${path.relative(contractsDir, fullPath)}: ${err.message}`);
        hasError = true;
      }
    }
  }
}

try {
  validateJsonFilesInDir(tokensDir);

  if (hasError) {
    console.error('🚨 Validation Failed! Harness blocked the build.');
    process.exit(1);
  } else {
    console.log('🎉 All design tokens are strictly valid against DTCG schema!');
  }
} catch (error) {
  console.error('Validation engine crashed:', error);
  process.exit(1);
}
