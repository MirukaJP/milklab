document.addEventListener('DOMContentLoaded', () => {
  // 抽出したいトークン名のリスト (デモ用)
  const primitiveColors = [
    '--color-base-blue-50',
    '--color-base-blue-500',
    '--color-base-blue-600',
    '--color-base-blue-900',
    '--color-base-gray-50',
    '--color-base-gray-500',
    '--color-base-gray-900'
  ];

  const semanticColors = [
    '--color-bg-primary',
    '--color-bg-primaryHover',
    '--color-text-default',
    '--color-text-inverse',
    '--color-text-muted'
  ];

  const rootStyles = getComputedStyle(document.documentElement);

  // Primitive カラーの描画
  const paletteGrid = document.getElementById('palette-grid');
  if (paletteGrid) {
    primitiveColors.forEach(varName => {
      const hexValue = rootStyles.getPropertyValue(varName).trim();
      if (!hexValue) return;

      const card = document.createElement('div');
      card.className = 'color-card';
      
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = `var(${varName})`;

      const info = document.createElement('div');
      info.className = 'color-info';
      
      const name = document.createElement('div');
      name.className = 'color-name';
      name.textContent = varName.replace('--color-base-', '');

      const hex = document.createElement('div');
      hex.className = 'color-hex';
      hex.textContent = hexValue || `var(${varName})`;

      info.appendChild(name);
      info.appendChild(hex);
      card.appendChild(swatch);
      card.appendChild(info);
      paletteGrid.appendChild(card);
    });
  }

  // Semantic カラーの描画
  const semanticList = document.getElementById('semantic-list');
  if (semanticList) {
    semanticColors.forEach(varName => {
      const hexValue = rootStyles.getPropertyValue(varName).trim();
      if (!hexValue) return;

      const item = document.createElement('div');
      item.className = 'semantic-item';

      const swatch = document.createElement('div');
      swatch.className = 'semantic-swatch';
      swatch.style.backgroundColor = `var(${varName})`;

      const details = document.createElement('div');
      details.className = 'semantic-details';

      const name = document.createElement('div');
      name.className = 'semantic-name';
      name.textContent = varName.replace('--color-', '');

      const val = document.createElement('div');
      val.className = 'semantic-value';
      val.textContent = hexValue; // Computed CSS value

      details.appendChild(name);
      details.appendChild(val);
      item.appendChild(swatch);
      item.appendChild(details);
      semanticList.appendChild(item);
    });
  }
});
