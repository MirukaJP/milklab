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
      name: 'Café Neutrals (Milk, Latte & Espresso)',
      desc: '朝のミルク(50-200)、調和するカフェラテ(300-600)、そして深見のビターなエスプレッソ(700-950)を一続きにした、究極に美しい一本のメインキャンバススケール',
      rows: [
        [
          '--color-base-milk-50', '--color-base-milk-100', '--color-base-milk-200',
          '--color-base-latte-300', '--color-base-latte-400', '--color-base-latte-500', '--color-base-latte-600',
          '--color-base-espresso-700', '--color-base-espresso-800', '--color-base-espresso-900', '--color-base-espresso-950'
        ],
        [
          '--color-base-milk-glass', '--color-base-espresso-glass'
        ]
      ]
    },
    {
      name: 'Sky (Scenery & Time)',
      desc: '窓辺の快晴の朝食タイムから、日中のクリアな青（Primary）、そして静けさにとけゆく夜空の星陰まで',
      rows: [
        [
          '--color-base-sky-50', '--color-base-sky-100', '--color-base-sky-200', '--color-base-sky-300', '--color-base-sky-400', '--color-base-sky-500', '--color-base-sky-600', '--color-base-sky-700', '--color-base-sky-800', '--color-base-sky-900', '--color-base-sky-950'
        ]
      ]
    },
    {
      name: 'Toast (Food & Dessert - Warning)',
      desc: '朝のシリアルやとろけるバターから、香ばしくこんがり焼けたトースト、そして夜想のタルト・焼き菓子まで',
      rows: [
        [
          '--color-base-toast-50', '--color-base-toast-100', '--color-base-toast-200', '--color-base-toast-300', '--color-base-toast-400', '--color-base-toast-500', '--color-base-toast-600', '--color-base-toast-700', '--color-base-toast-800', '--color-base-toast-900', '--color-base-toast-950'
        ]
      ]
    },
    {
      name: 'Berry (Food & Dessert - Danger/Error)',
      desc: '朝の軽やかで可憐ないちごミルクから、暗がりでシックに映える夜食のフランボワーズまで',
      rows: [
        [
          '--color-base-berry-50', '--color-base-berry-100', '--color-base-berry-200', '--color-base-berry-300', '--color-base-berry-400', '--color-base-berry-500', '--color-base-berry-600', '--color-base-berry-700', '--color-base-berry-800', '--color-base-berry-900', '--color-base-berry-950'
        ]
      ]
    },
    {
      name: 'Herb (Room & Decoration - Success)',
      desc: '朝採り野菜サラダやミントから、就寝前の温かく心を沈静させるハーブティー・緑茶まで',
      rows: [
        [
          '--color-base-herb-50', '--color-base-herb-100', '--color-base-herb-200', '--color-base-herb-300', '--color-base-herb-400', '--color-base-herb-500', '--color-base-herb-600', '--color-base-herb-700', '--color-base-herb-800', '--color-base-herb-900', '--color-base-herb-950'
        ]
      ]
    },
    {
      name: 'Lavender (Room & Decoration - Relax & Magic)',
      desc: '朝のさわやかな涼みとハーブの香りから、夜のひとり時間を優しく包んで極上の安眠と集中を導くアロマ・バイオレット',
      rows: [
        [
          '--color-base-lavender-50', '--color-base-lavender-100', '--color-base-lavender-200', '--color-base-lavender-300', '--color-base-lavender-400', '--color-base-lavender-500', '--color-base-lavender-600', '--color-base-lavender-700', '--color-base-lavender-800', '--color-base-lavender-900', '--color-base-lavender-950'
        ]
      ]
    }
  ];

  const semanticGroups = [
    {
      title: 'Background & Surface (生活空間とレイヤー)',
      desc: '画面全体の背景からカード面、そして控えめなコンテナエリア(Muted)の構成',
      tokens: [
        { var: '--color-bg-default', desc: 'メイン背景色 (Default)' },
        { var: '--color-bg-surface', desc: 'カード・サイドバー手前レイヤー (Surface)' },
        { var: '--color-bg-muted', desc: '控えめなコンテナ背景 (Muted)' },
        { var: '--color-bg-glass', desc: 'すりガラス素材背景 (Glass)' },
        { var: '--color-bg-primary', desc: 'プライマリアクション・ボタン背景' }
      ]
    },
    {
      title: 'Status & Feature Backgrounds (状態・フィードバック背景)',
      desc: 'ハーブ・トースト・ベリー・ラベンダーを役割（成功・警告・エラー・アクセント）として割り振った標準背景色およびミュート（バッジ・通知用）背景',
      tokens: [
        { var: '--color-bg-success', desc: '成功・安全・完了背景 (Herb)' },
        { var: '--color-bg-success-muted', desc: '成功のミュート背景・通知タグ用 (Herb Muted)' },
        { var: '--color-bg-warning', desc: '警告・注意背景 (Toast)' },
        { var: '--color-bg-warning-muted', desc: '警告のミュート背景 (Toast Muted)' },
        { var: '--color-bg-danger', desc: '危険・エラー背景 (Berry)' },
        { var: '--color-bg-danger-muted', desc: 'エラーのミュート背景 (Berry Muted)' },
        { var: '--color-bg-accent', desc: '特別機能・AIアクセント背景 (Lavender)' },
        { var: '--color-bg-accent-muted', desc: 'アクセントのミュート背景 (Lavender Muted)' }
      ]
    },
    {
      title: 'Text & Typography (文字・アイコン色)',
      desc: '厳格なアクセシビリティを保つテキスト群。色見本は文字「Ag」で体感できます',
      tokens: [
        { var: '--color-text-default', desc: '基本テキスト (Default)' },
        { var: '--color-text-inverse', desc: '反転白系テキスト (Inverse)' },
        { var: '--color-text-muted', desc: '補助・ミュートテキスト (Muted)' },
        { var: '--color-text-disabled', desc: '無効・退行テキスト (Disabled)' },
        { var: '--color-text-primary', desc: 'プライマリオール / リンク (Sky)' },
        { var: '--color-text-success', desc: '成功・完了文字 (Herb)' },
        { var: '--color-text-warning', desc: '警告・注意文字 (Toast)' },
        { var: '--color-text-danger', desc: '危険・エラー文字 (Berry)' },
        { var: '--color-text-accent', desc: '装飾・アクセント文字 (Lavender)' }
      ]
    },
    {
      title: 'Border & Dividers (境界線・アウトライン)',
      desc: '空間と UI の輪郭を引き締めたり、ステータスを際立たせる充実した線定義。枠線サンプルで体感いただけます',
      tokens: [
        { var: '--color-border-default', desc: '標準的な区切り線・コンポーネント枠 (Default)' },
        { var: '--color-border-muted', desc: 'さらに控えめな極薄ミュート区切り線 (Muted)' },
        { var: '--color-border-focus', desc: 'キーボードフォーカス・選択アウトライン (Sky)' },
        { var: '--color-border-primary', desc: 'プライマリー選択・強調フレーム線 (Sky)' },
        { var: '--color-border-success', desc: '成功・安全ステータス枠線 (Herb)' },
        { var: '--color-border-success-muted', desc: '成功バッジ・通知用ミュート枠線 (Herb Muted)' },
        { var: '--color-border-warning', desc: '注意・警告ステータス枠線 (Toast)' },
        { var: '--color-border-warning-muted', desc: '注意バッジ・アラート用ミュート枠線 (Toast Muted)' },
        { var: '--color-border-danger', desc: '危険・バリデーションエラー枠 (Berry)' },
        { var: '--color-border-danger-muted', desc: 'エラーバッジ・ソフトアラートミュート枠線 (Berry Muted)' },
        { var: '--color-border-accent', desc: '特別フィーチャー・AI装飾アクセント枠 (Lavender)' },
        { var: '--color-border-accent-muted', desc: 'アクセント用優しいミュート枠線 (Lavender Muted)' }
      ]
    },
    {
      title: 'State Layers (半透明インタラクション・ベール)',
      desc: '無機質な黒の影を排し、システム根幹の Espresso-900 や Milk 50 をベースにした温かみ溢れる光と影の半透明レイヤー',
      tokens: [
        { var: '--color-state-hover', desc: 'ホバー時ベール (Light は Espresso-900 由来の芳醇で深い影、Dark は月光のような Milk ツヤ)' },
        { var: '--color-state-active', desc: 'アクティブ・クリック時のベール (しっかりした心地よい手応え)' }
      ]
    }
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

          // 階調ステップ番号や名称(50, 600, glass等)を抽出（ニュートラル統合パレットは役割名 milk-200, latte-300 など明記して美しく表現）
          let stepName = varName.split('-').pop() || varName;
          if (varName.includes('milk') || varName.includes('latte') || varName.includes('espresso')) {
            stepName = varName.replace('--color-base-', '');
          }

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

  // Semantic カラーの描画 (Muted仕様・直感的カードグリッド)
  const semanticList = document.getElementById('semantic-list');
  if (semanticList) {
    semanticGroups.forEach(group => {
      const section = document.createElement('div');
      section.className = 'semantic-group-section';

      const header = document.createElement('div');
      header.className = 'semantic-group-header';
      header.innerHTML = `
        <h3 class="semantic-group-title">${group.title}</h3>
        <p class="semantic-group-desc">${group.desc}</p>
      `;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'semantic-grid';

      group.tokens.forEach(token => {
        const hexValue = rootStyles.getPropertyValue(token.var).trim();
        if (!hexValue) return;

        const card = document.createElement('div');
        card.className = 'semantic-card';

        const swatchWrapper = document.createElement('div');
        swatchWrapper.className = 'semantic-swatch-wrapper';

        // 役割(bg / text / border)による視覚的サンプル表示のスイッチ
        if (token.var.includes('-text-')) {
          const textSample = document.createElement('div');
          textSample.className = 'swatch-text-sample';
          textSample.textContent = 'Ag';
          textSample.style.color = `var(${token.var})`;
          swatchWrapper.appendChild(textSample);
        } else if (token.var.includes('-border-')) {
          const borderSample = document.createElement('div');
          borderSample.className = 'swatch-border-sample';
          borderSample.style.border = `3px solid var(${token.var})`;
          swatchWrapper.appendChild(borderSample);
        } else if (token.var.includes('-state-')) {
          // 半透明ベールが直感的に伝わるようにプライマリー色の上にかけるミニサンプル表現
          swatchWrapper.style.backgroundColor = 'var(--color-bg-primary)';
          const overlaySample = document.createElement('div');
          overlaySample.style.position = 'absolute';
          overlaySample.style.inset = '0';
          overlaySample.style.backgroundColor = `var(${token.var})`;
          swatchWrapper.appendChild(overlaySample);
        } else {
          // 背景色 (bg) はスワッチ自体に色を適用
          swatchWrapper.style.backgroundColor = `var(${token.var})`;
          if (token.var.includes('glass')) {
            swatchWrapper.style.backgroundImage = 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 8px, transparent 0, transparent 16px)';
          }
        }

        const details = document.createElement('div');
        details.className = 'semantic-details';
        details.innerHTML = `
          <div class="semantic-var-name">${token.var.replace('--color-', '')}</div>
          <div class="semantic-description">${token.desc}</div>
          <div class="semantic-hex">${hexValue}</div>
        `;

        card.appendChild(swatchWrapper);
        card.appendChild(details);
        grid.appendChild(card);
      });

      section.appendChild(grid);
      semanticList.appendChild(section);
    });
  }

  // ============================
  // ✍️ Typography Showcase (Colorセクションと完全調和する静的トンマナ見本)
  // ============================

  // 1. Font Size (文字の階調スケール)
  const sizeShowcase = document.getElementById('typo-size-showcase');
  if (sizeShowcase) {
    const sizeScale = [
      { varName: '--font-size-4xl', val: '36px (2.25rem)', desc: 'ヒーロー・巨大見出し用', text: 'Milklab Agentic Design' },
      { varName: '--font-size-3xl', val: '30px (1.875rem)', desc: 'ページタイトル・主要見出し用', text: 'カフェの温もりと最先端エージェントの調和' },
      { varName: '--font-size-2xl', val: '24px (1.5rem)', desc: 'カード見出し・セクションタイトル用', text: '透明感あるステータスベールとミュートカラー' },
      { varName: '--font-size-xl', val: '20px (1.25rem)', desc: '小見出し・モーダルヘッダー用', text: 'Outfit & Noto Sans JP' },
      { varName: '--font-size-lg', val: '18px (1.125rem)', desc: 'リード文章・少し大きめの本文', text: '心地よく直感的なコンポーネントシステムを構築します' },
      { varName: '--font-size-base', val: '16px (1rem)', desc: '【標準本文】ベースラインとなるサイズ', text: '標準的な文章や主要UI部品に最適な基準サイズです。すべてはここを起点に美しい比率で構成されています。' },
      { varName: '--font-size-sm', val: '14px (0.875rem)', desc: 'セカンダリボタン・補足コメント用', text: 'サブ情報、メタインフォメーションおよび各種ボタン・ラベル (14px / Medium)' },
      { varName: '--font-size-xs', val: '12px (0.75rem)', desc: 'バッジ・注釈・免責事項・フッターコピー用', text: 'バッジやミニタグ、注釈および補足情報用のコンパクトなスタイル。(12px)' }
    ];

    sizeScale.forEach(item => {
      const card = document.createElement('div');
      card.className = 'typography-card';
      card.innerHTML = `
        <div class="typography-header-row">
          <span class="typography-var-name">${item.varName.replace('--font-size-', '')}</span>
          <span class="typography-val">${item.val}</span>
          <span class="typography-desc">${item.desc}</span>
        </div>
        <div class="typography-sample" style="font-family: var(--font-family-sans); font-size: var(${item.varName}); font-weight: 500; line-height: var(--font-lineHeight-normal);">
          ${item.text}
        </div>
      `;
      sizeShowcase.appendChild(card);
    });
  }

  // 2. Font Weight (文字の太さ)
  const weightShowcase = document.getElementById('typo-weight-showcase');
  if (weightShowcase) {
    const weightScale = [
      { varName: '--font-weight-regular', val: '400', desc: '標準・長文テキストの基本ウェイト' },
      { varName: '--font-weight-medium', val: '500', desc: '中太・ボタンラベルや選択中タブ、少し視線を集めたい要素用' },
      { varName: '--font-weight-semibold', val: '600', desc: 'やや太・見出しや強調カードのヘッダータイトル用' },
      { varName: '--font-weight-bold', val: '700', desc: '極太・ページ大見出しや最上位インパクトを持たせるテキスト用' }
    ];

    weightScale.forEach(item => {
      const card = document.createElement('div');
      card.className = 'typography-card';
      card.innerHTML = `
        <div class="typography-header-row">
          <span class="typography-var-name">${item.varName.replace('--font-weight-', '')}</span>
          <span class="typography-val">${item.val}</span>
          <span class="typography-desc">${item.desc}</span>
        </div>
        <div class="typography-sample" style="font-family: var(--font-family-sans); font-size: var(--font-size-2xl); font-weight: var(${item.varName}); line-height: var(--font-lineHeight-normal);">
          Outfit & Noto Sans JP (Weight ${item.val})
        </div>
      `;
      weightShowcase.appendChild(card);
    });
  }

  // 3. Line Height (行間・密度)
  const lhShowcase = document.getElementById('typo-lh-showcase');
  if (lhShowcase) {
    const lhScale = [
      { varName: '--font-lineHeight-tight', val: '1.25', desc: '見出し専用・空間を引き締めインパクトを高める凝縮感' },
      { varName: '--font-lineHeight-normal', val: '1.5', desc: 'UIボタン・短文説明・通常のインターフェースにおける最適バランス' },
      { varName: '--font-lineHeight-relaxed', val: '1.75', desc: '長文ドキュメント・記事・ガイドライン用のゆとりある贅沢な行間' },
      { varName: '--font-lineHeight-loose', val: '2', desc: 'さらに行間の広い、開放的で余白リッチな空間演出および特別な長文ドキュメント用' }
    ];

    const sampleParagraph = 'Milklab デザインシステムは、温かく居心地の良いカフェ空間の美しさと、先進的でダイナミックな AI コーディングを融合させています。文字と文字の余白に息遣いをもたせ、ライトモードにはコーヒーの芳醇な陰影を、ダークモードには月光のようなツヤを与えることで、触感と美意識を満たすプロダクト体験を約束します。';

    lhScale.forEach(item => {
      const card = document.createElement('div');
      card.className = 'typography-card';
      card.innerHTML = `
        <div class="typography-header-row">
          <span class="typography-var-name">${item.varName.replace('--font-lineHeight-', '')}</span>
          <span class="typography-val">${item.val}</span>
          <span class="typography-desc">${item.desc}</span>
        </div>
        <div class="typography-sample" style="font-family: var(--font-family-sans); font-size: var(--font-size-base); font-weight: 400; line-height: var(${item.varName});">
          ${sampleParagraph}
        </div>
      `;
      lhShowcase.appendChild(card);
    });
  }
});

