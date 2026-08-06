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

// 1.5 Load Rules for Semantic Linting
const rulesPath = path.join(contractsDir, 'rules.json');
let rules: any = {};
try {
  rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
} catch (error) {
  console.log(`⚠️ Warning: rules.json not found or invalid.`);
}

const forbiddenKeys = rules.namingRules?.forbiddenKeys || [];
const gridBasePx = rules.spacingRules?.gridBasePx || 4;
const allowedMicroOffsets = rules.spacingRules?.allowedMicroOffsets || [];

function semanticLint(node: any, pathStr: string, filePath: string) {
  if (typeof node !== 'object' || node === null) return;
  
  for (const key in node) {
    const fullPath = pathStr ? `${pathStr}.${key}` : key;
    
    // Naming Rule Check
    for (const forbidden of forbiddenKeys) {
      const regex = new RegExp(`(^|[-_])(${forbidden})([-_]|$)`, 'i');
      if (regex.test(key)) {
        console.error(`❌ [Naming Violation] ${filePath} at "${fullPath}": Contains forbidden keyword "${forbidden}". Use explicit naming.`);
        hasError = true;
      }
    }
    
    const child = node[key];
    if (typeof child === 'object' && child !== null) {
      if ('$value' in child && '$type' in child) {
        // Spacing Math Check (Exclude borderRadius, font, size related dimension tokens)
        const isExcludedPath = fullPath.includes('borderRadius') || fullPath.includes('font') || fullPath.includes('lineHeight');
        if (!isExcludedPath && (child.$type === 'dimension' || child.$type === 'spacing') && typeof child.$value === 'string') {
          if (child.$value.endsWith('px')) {
            const num = parseFloat(child.$value.replace('px', ''));
            if (!isNaN(num)) {
              const isGrid = num % gridBasePx === 0;
              const isMicro = allowedMicroOffsets.includes(num);
              
              if (!isGrid && !isMicro) {
                 console.error(`❌ [Math Violation] ${filePath} at "${fullPath}": Value "${child.$value}" breaks the ${gridBasePx}px grid and is not an allowed micro offset [${allowedMicroOffsets.join(', ')}].`);
                 hasError = true;
              }
            }
          }
        }
      }
      semanticLint(child, fullPath, filePath);
    }
  }
}

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
        const relPath = path.relative(contractsDir, fullPath);
        
        const valid = validateTokens(data);
        if (!valid) {
          console.error(`❌ [Schema Violation] ${relPath}`);
          console.error(ajv.errorsText(validateTokens.errors, { separator: '\n' }));
          hasError = true;
        } else {
          // Run Semantic Linting
          semanticLint(data, '', relPath);
          console.log(`✅ [Pass] ${relPath} complies with schema and semantic rules.`);
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
