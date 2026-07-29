/**
 * HEXカラー(例: #3b82f6)から相対輝度(Relative Luminance)を計算する (WCAG 2.1準拠)
 */
export function getLuminance(hex: string): number {
  const sanitized = hex.replace('#', '');
  const r8 = parseInt(sanitized.substring(0, 2), 16);
  const g8 = parseInt(sanitized.substring(2, 4), 16);
  const b8 = parseInt(sanitized.substring(4, 6), 16);

  const [r, g, b] = [r8, g8, b8].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 2つのHEXカラー間のコントラスト比を計算する
 * 戻り値: 1.0 〜 21.0
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);

  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (lightest + 0.05) / (darkest + 0.05);
}
