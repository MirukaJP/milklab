import * as fs from 'fs';
import * as path from 'path';
import { getContrastRatio } from './utils/color';

console.log('🔍 Starting A11y Semantic Validation...');

const CONTRACTS_DIR = path.resolve(__dirname, '../contracts');

// 1. 各種JSONの読み込み
const rules = JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, 'rules.json'), 'utf8'));
const primitive = JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, 'tokens/primitive.json'), 'utf8'));
const semantic = JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, 'tokens/semantic.json'), 'utf8'));
const button = JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, 'components/button.json'), 'utf8'));

// 2. トークン辞書の作成（エイリアス解決用）
const tokenMap: Record<string, string> = {};

function flatten(obj: any, prefix = '') {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object' && '$value' in val) {
        tokenMap[newKey] = val.$value;
      } else if (val && typeof val === 'object') {
        flatten(val, newKey);
      }
    }
  }
}
flatten(primitive);
flatten(semantic);

function resolveValue(rawValue: string): string {
  const match = rawValue.match(/^\{(.+)\}$/);
  if (match) {
    const aliasKey = match[1];
    if (tokenMap[aliasKey]) {
      return resolveValue(tokenMap[aliasKey]);
    } else {
      throw new Error(`Alias not found: ${aliasKey}`);
    }
  }
  return rawValue; // 絶対値ならそのまま返す
}

// 3. コンポーネントの検証
const minContrast = rules.a11y.minimumContrastRatio;
console.log(`ℹ️ Required Minimum Contrast Ratio: ${minContrast}`);

let hasError = false;

function checkContrast(componentName: string, stateName: string, bgRaw: string, textRaw: string) {
  try {
    const bgHex = resolveValue(bgRaw);
    const textHex = resolveValue(textRaw);
    
    const ratio = getContrastRatio(bgHex, textHex);
    const roundedRatio = Math.round(ratio * 100) / 100;

    if (roundedRatio < minContrast) {
      console.error(`❌ [A11y Violation] ${componentName} (${stateName}): Contrast ratio ${roundedRatio} is below minimum ${minContrast}. (bg: ${bgHex}, text: ${textHex})`);
      hasError = true;
    } else {
      console.log(`✅ [Pass] ${componentName} (${stateName}): Contrast ratio ${roundedRatio} (bg: ${bgHex}, text: ${textHex})`);
    }
  } catch (err: any) {
    console.error(`❌ Error resolving tokens for ${componentName}: ${err.message}`);
    hasError = true;
  }
}

// Buttonコンポーネントの Default ステートの検証
if (button.tokens && button.tokens.bg && button.tokens.text) {
  const bgDefault = button.tokens.bg.default.$value;
  const textDefault = button.tokens.text.default.$value;
  checkContrast('Button', 'default', bgDefault, textDefault);
}

if (hasError) {
  console.error('🚨 A11y Semantic Validation Failed! Harness blocked the build.');
  process.exit(1);
} else {
  console.log('🎉 All semantic combinations are accessible!');
}
