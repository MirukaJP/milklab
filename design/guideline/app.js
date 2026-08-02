document.addEventListener('DOMContentLoaded', () => {
  console.log('Guideline Portal Initialized.');
  
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.target.value);
    });
  }

  // 抽出してプレビュー描画するPrimitiveトークン名のリスト
  const primitiveColors = [
    '--color-base-milk-50', '--color-base-milk-100', '--color-base-milk-200', '--color-base-milk-300', '--color-base-milk-400', '--color-base-milk-glass',
    '--color-base-espresso-500', '--color-base-espresso-600', '--color-base-espresso-700', '--color-base-espresso-800', '--color-base-espresso-900', '--color-base-espresso-950', '--color-base-espresso-glass',
    '--color-base-latte-50', '--color-base-latte-100', '--color-base-latte-200', '--color-base-latte-300', '--color-base-latte-400', '--color-base-latte-500', '--color-base-latte-600', '--color-base-latte-700', '--color-base-latte-800', '--color-base-latte-900',
    '--color-base-sky-50', '--color-base-sky-100', '--color-base-sky-200', '--color-base-sky-300', '--color-base-sky-400', '--color-base-sky-500', '--color-base-sky-600', '--color-base-sky-700', '--color-base-sky-800', '--color-base-sky-900', '--color-base-sky-950',
    '--color-base-toast-50', '--color-base-toast-100', '--color-base-toast-200', '--color-base-toast-300', '--color-base-toast-400', '--color-base-toast-500', '--color-base-toast-600', '--color-base-toast-700', '--color-base-toast-800', '--color-base-toast-900',
    '--color-base-berry-50', '--color-base-berry-100', '--color-base-berry-200', '--color-base-berry-300', '--color-base-berry-400', '--color-base-berry-500', '--color-base-berry-600', '--color-base-berry-700', '--color-base-berry-800', '--color-base-berry-900',
    '--color-base-herb-50', '--color-base-herb-100', '--color-base-herb-200', '--color-base-herb-300', '--color-base-herb-400', '--color-base-herb-500', '--color-base-herb-600', '--color-base-herb-700', '--color-base-herb-800', '--color-base-herb-900',
    '--color-base-lavender-50', '--color-base-lavender-100', '--color-base-lavender-200', '--color-base-lavender-300', '--color-base-lavender-400', '--color-base-lavender-500', '--color-base-lavender-600', '--color-base-lavender-700', '--color-base-lavender-800', '--color-base-lavender-900', '--color-base-lavender-950'
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
