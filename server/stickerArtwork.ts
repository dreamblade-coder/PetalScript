/**
 * Advanced Botanical Watercolor Die-Cut Stickers
 * Styled to perfectly match the rich organic textures, paper grain, and floral aesthetic of the bouquet.
 */

export interface BotanicalPresetSticker {
  id: string;
  name: string;
  prompt: string;
  badgeLabel: string;
  description: string;
  svg: string;
}

export function getCuratedStickerSvg(prompt: string): string | null {
  const p = prompt.toLowerCase();

  // 1. BOTANICAL CHIBI SPIDER-MAN WITH WILD ROSES
  if (p.includes('spiderman') || p.includes('spider-man') || p.includes('spidey')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <!-- Paper & Watercolor Grain Filter -->
        <filter id="watercolor-paper" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#3f2d20" flood-opacity="0.25" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.10 0" in="noise" result="softNoise" />
          <feBlend mode="multiply" in="SourceGraphic" in2="softNoise" />
        </filter>

        <!-- Rich Gouache Gradients -->
        <linearGradient id="roseGouache" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e11d48" />
          <stop offset="50%" stop-color="#be123c" />
          <stop offset="100%" stop-color="#881337" />
        </linearGradient>
        <linearGradient id="lapisBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="botanicalLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
        <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
        <linearGradient id="eyePearlescent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f1f5f9" />
        </linearGradient>
      </defs>

      <!-- Die-Cut Matte White Border with Paper Shadow -->
      <g filter="url(#watercolor-paper)">
        <!-- Outer Die-Cut Silhouette Border -->
        <path d="M 60,30 C 25,30 18,65 18,98 C 18,140 50,178 100,178 C 150,178 182,140 182,98 C 182,65 175,30 140,30 C 120,30 110,38 100,38 C 90,38 80,30 60,30 Z"
              fill="#fffdfa" stroke="#fffdfa" stroke-width="13" stroke-linejoin="round" />

        <!-- Botanical Foliage Spray Behind Suit -->
        <path d="M 40,140 Q 20,120 28,105 Q 36,120 45,130" fill="url(#botanicalLeaf)" />
        <path d="M 160,140 Q 180,120 172,105 Q 164,120 155,130" fill="url(#botanicalLeaf)" />

        <!-- Chibi Body in Deep Lapis & Carmine Gouache -->
        <path d="M 68,136 Q 58,172 74,172 Q 100,166 126,172 Q 142,172 132,136 Z" fill="url(#lapisBlue)" />
        <path d="M 85,136 L 85,168 L 115,168 L 115,136 Z" fill="url(#roseGouache)" />

        <!-- Chibi Big Spidey Head -->
        <path d="M 100,40 C 52,40 32,68 32,100 C 32,134 60,148 100,148 C 140,148 168,134 168,100 C 168,68 148,40 100,40 Z"
              fill="url(#roseGouache)" />

        <!-- Subtle Watercolor Texture Overlay on Mask -->
        <ellipse cx="70" cy="75" rx="28" ry="24" fill="#fb7185" opacity="0.3" />
        <ellipse cx="100" cy="130" rx="34" ry="12" fill="#881337" opacity="0.4" />

        <!-- Hand-Drawn Fine Webbing Lines -->
        <line x1="100" y1="42" x2="100" y2="146" stroke="#2a0815" stroke-width="2.2" opacity="0.75" />
        <line x1="100" y1="94" x2="38" y2="62" stroke="#2a0815" stroke-width="1.8" opacity="0.65" />
        <line x1="100" y1="94" x2="38" y2="122" stroke="#2a0815" stroke-width="1.8" opacity="0.65" />
        <line x1="100" y1="94" x2="162" y2="62" stroke="#2a0815" stroke-width="1.8" opacity="0.65" />
        <line x1="100" y1="94" x2="162" y2="122" stroke="#2a0815" stroke-width="1.8" opacity="0.65" />
        <line x1="100" y1="94" x2="66" y2="44" stroke="#2a0815" stroke-width="1.8" opacity="0.65" />
        <line x1="100" y1="94" x2="134" y2="44" stroke="#2a0815" stroke-width="1.8" opacity="0.65" />
        <!-- Soft organic web arcs -->
        <path d="M 76,80 Q 100,88 124,80" fill="none" stroke="#2a0815" stroke-width="2" opacity="0.7" />
        <path d="M 62,106 Q 100,118 138,106" fill="none" stroke="#2a0815" stroke-width="2" opacity="0.7" />
        <path d="M 70,128 Q 100,138 130,128" fill="none" stroke="#2a0815" stroke-width="2" opacity="0.7" />

        <!-- Expressive Chibi Eyes with Botanical Rose Gold Rim -->
        <!-- Left Eye -->
        <path d="M 44,92 C 50,66 82,76 88,96 C 88,112 56,120 44,92 Z" fill="#0f172a" />
        <path d="M 48,93 C 54,72 80,80 84,96 C 84,108 58,115 48,93 Z" fill="url(#eyePearlescent)" stroke="#d97706" stroke-width="1" />
        <!-- Right Eye -->
        <path d="M 156,92 C 150,66 118,76 112,96 C 112,112 144,120 156,92 Z" fill="#0f172a" />
        <path d="M 152,93 C 146,72 120,80 116,96 C 116,108 142,115 152,93 Z" fill="url(#eyePearlescent)" stroke="#d97706" stroke-width="1" />

        <!-- Spider Emblem with Golden Tint -->
        <ellipse cx="100" cy="148" rx="4" ry="6" fill="#0f172a" />
        <circle cx="100" cy="148" r="2" fill="url(#goldAcc)" />
        <path d="M 96,145 L 86,140 M 96,148 L 84,148 M 96,151 L 86,156 M 104,145 L 114,140 M 104,148 L 116,148 M 104,151 L 114,156" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" />

        <!-- ==========================================
             BOTANICAL WILD ROSE & BLOSSOMS IN HAND
             ========================================== -->
        <!-- Hand holding blooming wild rose -->
        <circle cx="50" cy="144" r="12" fill="url(#roseGouache)" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="150" cy="144" r="12" fill="url(#roseGouache)" stroke="#ffffff" stroke-width="1.5" />

        <!-- Wild Rose Bloom in Hand -->
        <path d="M 154,142 Q 168,130 172,115" stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 166,128 Q 178,124 172,135 Z" fill="#22c55e" />
        <!-- Rose Petals -->
        <circle cx="174" cy="112" r="9" fill="#be123c" />
        <circle cx="172" cy="110" r="7" fill="#fb7185" />
        <circle cx="175" cy="113" r="5" fill="#f43f5e" />
        <circle cx="173" cy="111" r="2.5" fill="#fef08a" />
        <!-- Dewdrop on petal -->
        <ellipse cx="178" cy="108" rx="1.5" ry="2" fill="#ffffff" opacity="0.8" />

        <!-- Tiny Golden Stardust Spores -->
        <circle cx="140" cy="85" r="2" fill="url(#goldAcc)" />
        <circle cx="62" cy="82" r="1.5" fill="url(#goldAcc)" />
        <circle cx="160" cy="155" r="2" fill="url(#goldAcc)" />
      </g>
    </svg>`;
  }

  // 2. ENCHANTED BABY DRAGON HOLDING A FRESH BOTANICAL TULIP
  if (p.includes('dragon')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <filter id="watercolor-paper" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#2d3748" flood-opacity="0.22" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.10 0" in="noise" result="softNoise" />
          <feBlend mode="multiply" in="SourceGraphic" in2="softNoise" />
        </filter>

        <linearGradient id="sageGouache" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#86efac" />
          <stop offset="50%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
        <linearGradient id="custardBelly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef9c3" />
          <stop offset="100%" stop-color="#fde047" />
        </linearGradient>
        <linearGradient id="botanicalTulip" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fda4af" />
          <stop offset="50%" stop-color="#f43f5e" />
          <stop offset="100%" stop-color="#be123c" />
        </linearGradient>
        <linearGradient id="lavenderHorn" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d8b4fe" />
          <stop offset="100%" stop-color="#9333ea" />
        </linearGradient>
      </defs>

      <!-- Die-Cut Matte Paper Silhouette -->
      <g filter="url(#watercolor-paper)">
        <path d="M 65,28 C 38,28 26,55 26,88 C 26,128 42,176 100,176 C 154,176 174,136 174,88 C 174,55 162,28 135,28 C 115,28 108,36 100,36 C 92,36 85,28 65,28 Z"
              fill="#fffdfa" stroke="#fffdfa" stroke-width="13" stroke-linejoin="round" />

        <!-- Dragon Tail with Leafy Spines -->
        <path d="M 138,152 Q 176,162 178,138 Q 180,126 164,128" fill="none" stroke="url(#sageGouache)" stroke-width="13" stroke-linecap="round" />
        <path d="M 172,130 Q 185,125 180,138 Z" fill="url(#lavenderHorn)" />

        <!-- Dragon Wings in Soft Watercolor Lavender -->
        <path d="M 44,98 C 22,88 18,114 44,120 Z" fill="url(#lavenderHorn)" opacity="0.92" />
        <path d="M 146,98 C 178,88 182,114 146,120 Z" fill="url(#lavenderHorn)" opacity="0.92" />

        <!-- Chubby Dragon Body -->
        <ellipse cx="100" cy="136" rx="43" ry="38" fill="url(#sageGouache)" />
        <!-- Custard Belly with Hand-drawn Scales -->
        <ellipse cx="98" cy="142" rx="27" ry="24" fill="url(#custardBelly)" />
        <path d="M 86,136 Q 98,140 110,136 M 88,146 Q 98,150 108,146" stroke="#a16207" stroke-width="1.8" stroke-linecap="round" fill="none" />

        <!-- Tiny Chubby Feet with Claws -->
        <ellipse cx="72" cy="168" rx="14" ry="10" fill="url(#sageGouache)" />
        <ellipse cx="126" cy="168" rx="14" ry="10" fill="url(#sageGouache)" />

        <!-- Dragon Head with Watercolor Bloom Highlights -->
        <ellipse cx="100" cy="80" rx="46" ry="40" fill="url(#sageGouache)" />
        <ellipse cx="80" cy="68" rx="20" ry="14" fill="#bbf7d0" opacity="0.45" />

        <!-- Little Lavender Horns with Gold Tips -->
        <path d="M 68,48 Q 60,26 76,30 Q 80,40 76,50 Z" fill="url(#lavenderHorn)" stroke="#ffffff" stroke-width="1.2" />
        <circle cx="68" cy="30" r="3" fill="#fef08a" />
        <path d="M 132,48 Q 140,26 124,30 Q 120,40 124,50 Z" fill="url(#lavenderHorn)" stroke="#ffffff" stroke-width="1.2" />
        <circle cx="132" cy="30" r="3" fill="#fef08a" />

        <!-- Giant Sparkling Anime Eyes -->
        <ellipse cx="78" cy="82" rx="11" ry="14" fill="#0f172a" />
        <ellipse cx="75" cy="78" rx="4.5" ry="6" fill="#ffffff" />
        <circle cx="82" cy="88" r="2.5" fill="#ffffff" />
        <circle cx="76" cy="89" r="1.5" fill="#4ade80" />

        <ellipse cx="122" cy="82" rx="11" ry="14" fill="#0f172a" />
        <ellipse cx="119" cy="78" rx="4.5" ry="6" fill="#ffffff" />
        <circle cx="126" cy="88" r="2.5" fill="#ffffff" />
        <circle cx="120" cy="89" r="1.5" fill="#4ade80" />

        <!-- Blushing Watercolor Cheeks -->
        <ellipse cx="64" cy="94" rx="8" ry="4.5" fill="#fb7185" opacity="0.55" />
        <ellipse cx="136" cy="94" rx="8" ry="4.5" fill="#fb7185" opacity="0.55" />

        <!-- Cute Smile -->
        <circle cx="95" cy="88" r="1.5" fill="#14532d" />
        <circle cx="105" cy="88" r="1.5" fill="#14532d" />
        <path d="M 94,95 Q 100,102 106,95" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />

        <!-- ==============================================
             EXQUISITE BOTANICAL TULIP WITH ORGANIC TEXTURE
             ============================================== -->
        <!-- Tulip Stem with Natural Leaf Veins -->
        <path d="M 106,120 Q 112,145 110,164" fill="none" stroke="#15803d" stroke-width="4.5" stroke-linecap="round" />
        <!-- Organic Green Leaf with Dewdrops -->
        <path d="M 112,138 Q 132,134 124,148 Q 114,148 111,142 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.2" />
        <ellipse cx="122" cy="140" rx="1.5" ry="2" fill="#ffffff" opacity="0.75" />

        <!-- Tulip Bloom with Velvety Watercolor Petals -->
        <path d="M 96,116 C 90,96 108,90 108,108 C 108,90 126,96 120,116 Z" fill="#9f1239" />
        <path d="M 100,122 C 94,104 108,94 108,104 C 108,94 122,104 116,122 C 112,126 104,126 100,122 Z" fill="url(#botanicalTulip)" stroke="#ffffff" stroke-width="1.4" />
        <!-- Shading stroke in petal fold -->
        <path d="M 108,102 L 108,122" stroke="#fda4af" stroke-width="1.8" stroke-linecap="round" />

        <!-- Little Dragon Paws Cradling Tulip -->
        <circle cx="94" cy="132" r="8" fill="url(#sageGouache)" stroke="#ffffff" stroke-width="1.4" />
        <circle cx="118" cy="132" r="8" fill="url(#sageGouache)" stroke="#ffffff" stroke-width="1.4" />

        <!-- Golden Stardust Pollen Floating Around -->
        <path d="M 132,102 Q 135,94 138,102 Q 146,105 138,108 Q 135,116 132,108 Q 124,105 132,102 Z" fill="#fef08a" />
        <circle cx="86" cy="112" r="2" fill="#fef08a" />
        <circle cx="126" cy="116" r="1.5" fill="#fef08a" />
      </g>
    </svg>`;
  }

  // 3. WATERCOLOR BOBA PANDA WITH JASMINE
  if (p.includes('panda')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <filter id="watercolor-paper" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#1e293b" flood-opacity="0.22" />
        </filter>
        <linearGradient id="bobaTea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdba74" />
          <stop offset="100%" stop-color="#c2410c" />
        </linearGradient>
      </defs>
      <g filter="url(#watercolor-paper)">
        <!-- Die-Cut Contour -->
        <ellipse cx="100" cy="100" rx="72" ry="74" fill="#fffdfa" stroke="#fffdfa" stroke-width="12" />

        <!-- Bamboo foliage sprigs -->
        <path d="M 38,130 Q 18,110 32,95 Z" fill="#15803d" />
        <path d="M 162,130 Q 182,110 168,95 Z" fill="#15803d" />

        <!-- Ears -->
        <circle cx="54" cy="52" r="20" fill="#1e293b" />
        <circle cx="146" cy="52" r="20" fill="#1e293b" />
        <!-- Head -->
        <ellipse cx="100" cy="90" rx="54" ry="46" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />

        <!-- Eye Patches -->
        <ellipse cx="74" cy="84" rx="15" ry="18" fill="#1e293b" transform="rotate(-15, 74, 84)" />
        <ellipse cx="126" cy="84" rx="15" ry="18" fill="#1e293b" transform="rotate(15, 126, 84)" />
        <circle cx="76" cy="82" r="5" fill="#ffffff" />
        <circle cx="124" cy="82" r="5" fill="#ffffff" />

        <!-- Snout & Blushing Cheeks -->
        <ellipse cx="100" cy="98" rx="14" ry="10" fill="#ffffff" />
        <path d="M 94,96 C 94,92 106,92 106,96 C 106,102 94,102 94,96 Z" fill="#1e293b" />
        <path d="M 96,102 Q 100,106 104,102" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" />
        <circle cx="58" cy="98" r="8" fill="#f43f5e" opacity="0.45" />
        <circle cx="142" cy="98" r="8" fill="#f43f5e" opacity="0.45" />

        <!-- Body & Boba Cup with Tapioca Pearls -->
        <ellipse cx="100" cy="145" rx="42" ry="34" fill="#1e293b" />
        <ellipse cx="100" cy="148" rx="26" ry="24" fill="#ffffff" />
        <path d="M 88,126 L 92,164 Q 100,168 108,164 L 112,126 Z" fill="url(#bobaTea)" stroke="#475569" stroke-width="2" />
        <line x1="100" y1="110" x2="100" y2="128" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" />
        <circle cx="95" cy="158" r="2.5" fill="#0f172a" />
        <circle cx="100" cy="160" r="2.5" fill="#0f172a" />
        <circle cx="105" cy="158" r="2.5" fill="#0f172a" />

        <!-- Jasmine Flower on Head -->
        <circle cx="128" cy="54" r="6" fill="#ffffff" stroke="#fef08a" stroke-width="1.5" />
        <circle cx="128" cy="54" r="2.5" fill="#fef08a" />
      </g>
    </svg>`;
  }

  // 4. BOTANICAL SPACE ASTRONAUT CAT
  if (p.includes('cat') || p.includes('kitten')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <filter id="watercolor-paper" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#1e293b" flood-opacity="0.22" />
        </filter>
        <linearGradient id="catGinger" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fb923c" />
          <stop offset="100%" stop-color="#c2410c" />
        </linearGradient>
      </defs>
      <g filter="url(#watercolor-paper)">
        <circle cx="100" cy="100" r="74" fill="#fffdfa" stroke="#fffdfa" stroke-width="12" />

        <!-- Helmet -->
        <circle cx="100" cy="90" r="56" fill="#e0f2fe" opacity="0.85" stroke="#94a3b8" stroke-width="3" />
        <ellipse cx="80" cy="65" rx="14" ry="7" fill="#ffffff" opacity="0.6" transform="rotate(-30, 80, 65)" />

        <!-- Ears with Lavender sprigs -->
        <polygon points="62,56 78,32 90,54" fill="url(#catGinger)" />
        <polygon points="68,52 78,38 86,52" fill="#fda4af" />
        <polygon points="138,56 122,32 110,54" fill="url(#catGinger)" />
        <polygon points="132,52 122,38 114,52" fill="#fda4af" />

        <!-- Face -->
        <circle cx="100" cy="94" r="36" fill="url(#catGinger)" />
        <ellipse cx="100" cy="102" rx="20" ry="16" fill="#fff7ed" />
        <circle cx="86" cy="88" r="7" fill="#0f172a" />
        <circle cx="84" cy="86" r="2.5" fill="#ffffff" />
        <circle cx="114" cy="88" r="7" fill="#0f172a" />
        <circle cx="112" cy="86" r="2.5" fill="#ffffff" />

        <polygon points="98,96 102,96 100,99" fill="#f43f5e" />
        <path d="M 96,101 Q 100,105 104,101" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />

        <!-- Botanical Collar Blossom -->
        <rect x="74" y="140" width="52" height="26" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
        <circle cx="100" cy="152" r="6" fill="#f43f5e" />
        <circle cx="100" cy="152" r="2.5" fill="#fef08a" />
      </g>
    </svg>`;
  }

  // 5. GOLDEN BUTTERFLY ON FLOWER PETALS
  if (p.includes('butterfly') || p.includes('moth')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <filter id="watercolor-paper" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#451a03" flood-opacity="0.22" />
        </filter>
        <linearGradient id="butterGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
      </defs>
      <g filter="url(#watercolor-paper)">
        <!-- Die-Cut Contour -->
        <path d="M 100,45 C 70,15 25,35 25,85 C 25,120 70,165 100,175 C 130,165 175,120 175,85 C 175,35 130,15 100,45 Z" fill="#fffdfa" stroke="#fffdfa" stroke-width="12" />

        <!-- Butterfly Wings with Botanical Floral Veins -->
        <path d="M 100,90 Q 50,30 35,65 Q 25,100 80,115 Z" fill="url(#butterGold)" stroke="#78350f" stroke-width="2" />
        <path d="M 100,90 Q 150,30 165,65 Q 175,100 120,115 Z" fill="url(#butterGold)" stroke="#78350f" stroke-width="2" />
        <path d="M 100,115 Q 55,130 50,155 Q 85,165 100,125 Z" fill="url(#butterGold)" stroke="#78350f" stroke-width="1.8" />
        <path d="M 100,115 Q 145,130 150,155 Q 115,165 100,125 Z" fill="url(#butterGold)" stroke="#78350f" stroke-width="1.8" />

        <!-- Body & Antennae with Dewdrops -->
        <ellipse cx="100" cy="105" rx="5" ry="24" fill="#451a03" />
        <path d="M 98,82 Q 90,65 82,68 M 102,82 Q 110,65 118,68" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
        <circle cx="82" cy="68" r="2.5" fill="#fef08a" />
        <circle cx="118" cy="68" r="2.5" fill="#fef08a" />
      </g>
    </svg>`;
  }

  // 6. STRAWBERRY CORGI
  if (p.includes('corgi') || p.includes('dog') || p.includes('puppy')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <filter id="watercolor-paper" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#451a03" flood-opacity="0.22" />
        </filter>
        <linearGradient id="corgiGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
      </defs>
      <g filter="url(#watercolor-paper)">
        <circle cx="100" cy="100" r="74" fill="#fffdfa" stroke="#fffdfa" stroke-width="12" />

        <!-- Ears -->
        <polygon points="50,65 65,22 85,55" fill="url(#corgiGold)" />
        <polygon points="56,60 67,32 79,54" fill="#fed7aa" />
        <polygon points="150,65 135,22 115,55" fill="url(#corgiGold)" />
        <polygon points="144,60 133,32 121,54" fill="#fed7aa" />

        <!-- Strawberry Hat with Leaf -->
        <path d="M 85,38 C 85,25 115,25 115,38 C 118,52 82,52 85,38 Z" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
        <circle cx="94" cy="38" r="1.5" fill="#fef08a" />
        <circle cx="106" cy="38" r="1.5" fill="#fef08a" />
        <path d="M 100,24 Q 102,16 100,14" stroke="#15803d" stroke-width="2.5" fill="none" stroke-linecap="round" />

        <!-- Head & Blaze -->
        <ellipse cx="100" cy="95" rx="52" ry="44" fill="url(#corgiGold)" />
        <path d="M 94,65 L 106,65 L 114,115 L 86,115 Z" fill="#ffffff" />
        <circle cx="78" cy="90" r="6.5" fill="#0f172a" />
        <circle cx="76" cy="88" r="2.5" fill="#ffffff" />
        <circle cx="122" cy="90" r="6.5" fill="#0f172a" />
        <circle cx="120" cy="88" r="2.5" fill="#ffffff" />

        <circle cx="62" cy="102" r="8" fill="#fda4af" opacity="0.6" />
        <circle cx="138" cy="102" r="8" fill="#fda4af" opacity="0.6" />
        <ellipse cx="100" cy="102" rx="8" ry="6" fill="#0f172a" />
        <path d="M 98,111 C 98,111 96,122 100,122 C 104,122 102,111 102,111 Z" fill="#fb7185" />
      </g>
    </svg>`;
  }

  return null;
}

/**
 * Creates an exquisite universal botanical watercolor die-cut sticker SVG for any arbitrary prompt.
 * Blends with the bouquet texture using delicate watercolor gradients, paper texture, and floral wreath.
 */
export function createUniversalCustomStickerSvg(title: string, themeColor: string = '#be123c'): string {
  const safeTitle = title.length > 20 ? title.slice(0, 18) + '...' : title;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <filter id="watercolor-paper" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#3f2d20" flood-opacity="0.22" />
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" in="noise" result="softNoise" />
        <feBlend mode="multiply" in="SourceGraphic" in2="softNoise" />
      </filter>

      <linearGradient id="petalGouache" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${themeColor}" />
        <stop offset="100%" stop-color="#e11d48" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#4ade80" />
        <stop offset="100%" stop-color="#15803d" />
      </linearGradient>
    </defs>

    <g filter="url(#watercolor-paper)">
      <!-- Die-Cut Matte Ivory Paper Contour -->
      <path d="M 50,28 C 20,28 18,58 18,95 C 18,136 45,176 100,176 C 155,176 182,136 182,95 C 182,58 180,28 150,28 C 120,28 110,38 100,38 C 90,38 80,28 50,28 Z"
            fill="#fffdfa" stroke="#fffdfa" stroke-width="13" stroke-linejoin="round" />

      <!-- Botanical Foliage Garland Border -->
      <path d="M 32,80 Q 20,95 35,110 Z" fill="url(#leafGrad)" />
      <path d="M 168,80 Q 180,95 165,110 Z" fill="url(#leafGrad)" />
      <circle cx="36" cy="72" r="3" fill="#fef08a" />
      <circle cx="164" cy="72" r="3" fill="#fef08a" />

      <!-- Inner Artisan Watercolor Medallion -->
      <path d="M 52,32 C 24,32 24,60 24,95 C 24,132 48,168 100,168 C 152,168 176,132 176,95 C 176,60 176,32 148,32 C 120,32 110,42 100,42 C 90,42 80,32 52,32 Z"
            fill="url(#petalGouache)" opacity="0.9" />

      <!-- Delicate Botanical Rose Petals in Core -->
      <circle cx="100" cy="86" r="32" fill="#fffdfa" opacity="0.96" />
      <!-- Blooming Petals -->
      <path d="M 100,64 C 92,64 88,74 94,82 C 86,84 86,96 96,98 C 96,106 108,106 112,98 C 120,96 120,84 112,82 C 116,74 108,64 100,64 Z"
            fill="${themeColor}" opacity="0.85" />
      <circle cx="100" cy="86" r="8" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />

      <!-- Dewdrop accents -->
      <ellipse cx="78" cy="75" rx="2" ry="3" fill="#ffffff" opacity="0.75" />
      <ellipse cx="124" cy="75" rx="2" ry="3" fill="#ffffff" opacity="0.75" />

      <!-- Hand-Lettered Artisan Ribbon for Title -->
      <rect x="30" y="132" width="140" height="26" rx="9" fill="#fffdfa" stroke="#fed7aa" stroke-width="1.5" />
      <text x="100" y="149" text-anchor="middle" font-family="'Caveat', cursive, serif" font-size="14" font-weight="700" fill="#451a03" letter-spacing="0.5">
        ${safeTitle}
      </text>
    </g>
  </svg>`;
}

/**
 * Curated list of advanced Botanical AI Stickers ready for 1-click addition
 */
export const BOTANICAL_AI_PRESETS: BotanicalPresetSticker[] = [
  {
    id: 'botanical-spidey',
    name: 'Chibi Spiderman with Wild Roses',
    prompt: 'chibi spiderman holding a blooming wild rose with botanical foliage',
    badgeLabel: 'SPIDER-MAN',
    description: 'Chibi Spider-man in crimson and lapis gouache, holding a fresh wild rose',
    svg: getCuratedStickerSvg('spiderman')!,
  },
  {
    id: 'botanical-dragon',
    name: 'Baby Dragon with Pink Tulip',
    prompt: 'a cute baby dragon holding a tulip with botanical watercolor texture',
    badgeLabel: 'TULIP DRAGON',
    description: 'Emerald baby dragon with custard belly, holding a dewy pink tulip flower',
    svg: getCuratedStickerSvg('dragon')!,
  },
  {
    id: 'botanical-panda',
    name: 'Boba Panda with Jasmine',
    prompt: 'cute chubby panda drinking sweet boba tea with bamboo and jasmine flower',
    badgeLabel: 'BOBA PANDA',
    description: 'Watercolor panda holding iced boba tea with bamboo foliage',
    svg: getCuratedStickerSvg('panda')!,
  },
  {
    id: 'botanical-cat',
    name: 'Astronaut Kitty in Lavender',
    prompt: 'cute ginger kitten astronaut in space with lavender flowers and stars',
    badgeLabel: 'SPACE KITTY',
    description: 'Ginger space kitten floating in soft watercolor starlight with blossoms',
    svg: getCuratedStickerSvg('cat')!,
  },
  {
    id: 'botanical-butterfly',
    name: 'Golden Botanical Butterfly',
    prompt: 'golden fairy butterfly with delicate floral petal wing veins',
    badgeLabel: 'GOLDEN FAIRY',
    description: 'Enchanted swallowtail butterfly with honey gold watercolor textures',
    svg: getCuratedStickerSvg('butterfly')!,
  },
  {
    id: 'botanical-corgi',
    name: 'Strawberry Corgi Loaf',
    prompt: 'smiling corgi dog wearing a ripe garden strawberry hat',
    badgeLabel: 'CORGI LOAF',
    description: 'Golden corgi loaf wearing a fresh garden strawberry hat with leaves',
    svg: getCuratedStickerSvg('corgi')!,
  },
];
