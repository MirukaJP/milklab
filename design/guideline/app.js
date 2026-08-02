document.addEventListener('DOMContentLoaded', () => {
  console.log('Guideline Portal Initialized.');
  
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.target.value);
    });
  }

  // コンセプトごとにグルーピング・段（行）配置されたPrimitiveトークン設計
  const primitiveColorGroups = [
    {
      name: '🥛 Milk & ☕ Espresso (Café Bases & Glass)',
      desc: '朝の新鮮な牛乳と、目覚め・夜想を支えるエスプレッソ（1段目：ソリッドカラー帯、2段目：すりガラスマテリアル）',
      rows: [
        [
          '--color-base-milk-50', '--color-base-milk-100', '--color-base-milk-200', '--color-base-milk-300', '--color-base-milk-400',
          '--color-base-espresso-500', '--color-base-espresso-600', '--color-base-espresso-700', '--color-base-espresso-800', '--color-base-espresso-900', '--color-base-espresso-950'
        ],
        [
          '--color-base-milk-glass', '--color-base-espresso-glass'
        ]
      ]
    },
    {
      name: '🥤 Latte (Café Neutral)',
      desc: '牛乳とエスプレッソが黄金比で調和する、温もりを持ったシステム全体の本幹グレイスケール',
      rows: [
        [
          '--color-base-latte-50', '--color-base-latte-100', '--color-base-latte-200', '--color-base-latte-300', '--color-base-latte-400', '--color-base-latte-500', '--color-base-latte-600', '--color-base-latte-700', '--color-base-latte-800', '--color-base-latte-900', '--color-base-latte-950'
        ]
      ]
    },
    {
      name: '🌅🌌 Sky (Scenery & Time)',
      desc: '窓辺の快晴の朝食タイムから、日中のクリアな青（Primary）、そして静けさにとけゆく夜空の星陰まで',
      rows: [
        [
          '--color-base-sky-50', '--color-base-sky-100', '--color-base-sky-200', '--color-base-sky-300', '--color-base-sky-400', '--color-base-sky-500', '--color-base-sky-600', '--color-base-sky-700', '--color-base-sky-800', '--color-base-sky-900', '--color-base-sky-950'
        ]
      ]
    },
    {
      name: '🍞🥧 Toast (Food & Dessert - Warning)',
      desc: '朝のシリアルやとろけるバターから、香ばしくこんがり焼けたトースト、そして夜想のタルト・焼き菓子まで',
      rows: [
        [
          '--color-base-toast-50', '--color-base-toast-100', '--color-base-toast-200', '--color-base-toast-300', '--color-base-toast-400', '--color-base-toast-500', '--color-base-toast-600', '--color-base-toast-700', '--color-base-toast-800', '--color-base-toast-900', '--color-base-toast-950'
        ]
      ]
    },
    {
      name: '🍓 Berry (Food & Dessert - Danger/Error)',
      desc: '朝の軽やかで可憐ないちごミルクから、暗がりでシックに映える夜食のフランボワーズまで',
      rows: [
        [
          '--color-base-berry-50', '--color-base-berry-100', '--color-base-berry-200', '--color-base-berry-300', '--color-base-berry-400', '--color-base-berry-500', '--color-base-berry-600', '--color-base-berry-700', '--color-base-berry-800', '--color-base-berry-900', '--color-base-berry-950'
        ]
      ]
    },
    {
      name: '🌿 Herb (Room & Decoration - Success)',
      desc: '朝採り野菜サラダやミントから、就寝前の温かく心を沈静させるハーブティー・緑茶まで',
      rows: [
        [
          '--color-base-herb-50', '--color-base-herb-100', '--color-base-herb-200', '--color-base-herb-300', '--color-base-herb-400', '--color-base-herb-500', '--color-base-herb-600', '--color-base-herb-700', '--color-base-herb-800', '--color-base-herb-900', '--color-base-herb-950'
        ]
      ]
    },
    {
      name: '💜 Lavender (Room & Decoration - Relax & Magic)',
      desc: '朝のさわやかな涼みとハーブの香りから、夜のひとり時間を優しく包んで極上の安眠と集中を導くアロマ・バイオレット',
      rows: [
        [
          '--color-base-lavender-50', '--color-base-lavender-100', '--color-base-lavender-200', '--color-base-lavender-300', '--color-base-lavender-400', '--color-base-lavender-500', '--color-base-lavender-600', '--color-base-lavender-700', '--color-base-lavender-800', '--color-base-lavender-900', '--color-base-lavender-950'
        ]
      ]
    }
  ];

  const semanticColors = [
    '--color-bg-primary',
    '--color-bg-primaryHover',
    '--color-text-default',
    '--color-text-inverse',
    '--color-text-muted'
  ];

  const rootStyles = getComputedStyle(document.documentElement);

  // Primitive カラーの描画 (複数段・グループ対応)
  const paletteGrid = document.getElementById('palette-grid');
  if (paletteGrid) {
    primitiveColorGroups.forEach(group => {
      const groupCard = document.createElement('div');
      groupCard.className = 'palette-group';

      const header = document.createElement('div');
      header.className = 'palette-group-header';
      header.innerHTML = `
        <h3 class="palette-group-title">${group.name}</h3>
        <p class="palette-group-desc">${group.desc}</p>
      `;
      groupCard.appendChild(header);

      group.rows.forEach((rowTokens, rowIndex) => {
        const row = document.createElement('div');
        row.className = 'palette-row';
        if (rowIndex > 0) {
          row.style.marginTop = '1.25rem'; // 2段目以降（glass等）に美しいスペースを開ける
        }

        rowTokens.forEach(varName => {
          const hexValue = rootStyles.getPropertyValue(varName).trim();
          if (!hexValue) return;

          const tile = document.createElement('div');
          tile.className = 'color-tile';

          const swatch = document.createElement('div');
          swatch.className = 'color-swatch-strip';
          swatch.style.backgroundColor = `var(${varName})`;

          // すりガラス等の半透明を映えさせる軽やかなチェッカー・プレースホルダー工夫
          if (varName.includes('glass')) {
            swatch.style.backgroundImage = 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 8px, transparent 0, transparent 16px)';
          }

          const info = document.createElement('div');
          info.className = 'color-tile-info';

          // 階調ステップ番号や名称(50, 600, glass等)を抽出
          const stepName = varName.split('-').pop() || varName;

          const nameEl = document.createElement('div');
          nameEl.className = 'color-step-name';
          nameEl.textContent = stepName;

          const hexEl = document.createElement('div');
          hexEl.className = 'color-hex-code';
          hexEl.textContent = hexValue;

          info.appendChild(nameEl);
          info.appendChild(hexEl);
          tile.appendChild(swatch);
          tile.appendChild(info);
          row.appendChild(tile);
        });

        groupCard.appendChild(row);
      });

      paletteGrid.appendChild(groupCard);
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
