import * as fs from 'fs';
import * as path from 'path';

// 対象のJSONファイル群
const CONTRACTS_DIR = path.resolve(__dirname, '../../contracts/tokens');
const COMPONENT_DIR = path.resolve(__dirname, '../../contracts/components');
const OUT_DIR = path.resolve(__dirname, '../../guideline');
const OUT_FILE = path.join(OUT_DIR, 'tokens.css');

// フラット化したトークンを保持するマップ
const tokenMap: Record<string, string> = {};

/**
 * オブジェクトを再帰的に走査し、ドット区切りのキー名と$valueを抽出する
 */
function flattenTokens(obj: any, prefix = '') {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (val && typeof val === 'object' && '$value' in val) {
        tokenMap[newKey] = val.$value;
      } else if (val && typeof val === 'object') {
        flattenTokens(val, newKey);
      }
    }
  }
}

/**
 * トークンのエイリアス `{path.to.token}` を再帰的に解決する
 */
function resolveAliases(value: string, visited: Set<string> = new Set()): string {
  const aliasRegex = /\{([^}]+)\}/g;
  
  return value.replace(aliasRegex, (match, tokenKey) => {
    if (visited.has(tokenKey)) {
      throw new Error(`Circular dependency detected: ${tokenKey}`);
    }
    
    if (!(tokenKey in tokenMap)) {
      console.warn(`Warning: Unresolved alias ${match}`);
      return match;
    }
    
    visited.add(tokenKey);
    const resolved = resolveAliases(tokenMap[tokenKey], visited);
    visited.delete(tokenKey);
    return resolved;
  });
}

function generateCSSVariables() {
  console.log('🚀 Starting CSS Variables Transpilation...');
  
  // 1. JSONの読み込み
  const primitiveRaw = fs.readFileSync(path.join(CONTRACTS_DIR, 'primitive.json'), 'utf8');
  const semanticRaw = fs.readFileSync(path.join(CONTRACTS_DIR, 'semantic.json'), 'utf8');
  const buttonRaw = fs.readFileSync(path.join(COMPONENT_DIR, 'button.json'), 'utf8');
  
  const primitive = JSON.parse(primitiveRaw);
  const semantic = JSON.parse(semanticRaw);
  const button = JSON.parse(buttonRaw);
  
  // 2. フラット化
  flattenTokens(primitive);
  flattenTokens(semantic);
  // コンポーネントトークンのフラット化（button.tokens 配下）
  if (button.tokens) {
    flattenTokens(button.tokens, 'button');
  }

  // 3. エイリアス解決とCSS文字列の構築
  let cssContent = '/* Auto-generated Design Tokens */\n:root {\n';
  
  for (const [key, rawValue] of Object.entries(tokenMap)) {
    const resolvedValue = resolveAliases(rawValue);
    // CSS変数の命名規則: . を - に変換
    const cssVarName = `--${key.replace(/\./g, '-')}`;
    cssContent += `  ${cssVarName}: ${resolvedValue};\n`;
  }
  
  cssContent += '}\n';

  // 4. 出力先の確保とファイル書き出し
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  
  fs.writeFileSync(OUT_FILE, cssContent, 'utf8');
  console.log(`✅ CSS Variables generated at ${OUT_FILE}`);
}

try {
  generateCSSVariables();
} catch (error) {
  console.error('❌ Transpilation failed:', error);
  process.exit(1);
}
