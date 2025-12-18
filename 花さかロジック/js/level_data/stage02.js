import { TILE, DIR } from '../constants.js';

export const stage02 = {
  id: 2,
 
  // 21x12マスの広大なステージ
  map: [
    [0, 0, 3, 0, 0, 0, 3],
    [1, 1, 0, 1, 1, 1, 0], 
    [0, 0, 3, 0, 0, 0, 2],
  ],

  characters: [
      DIR.RIGHT  // 1人目：下向き（dir1）
  ],
  objects: [
    // 矢印の設定 (x,yでマップとリンク)
    { type: 'arrow', x: 2, y: 0, dir: 'DOWN' },
    { type: 'arrow', x: 6, y: 0, dir: 'DOWN' },
    { type: 'arrow', x: 2, y: 2, dir: 'RIGHT' },
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 4, y: 0 }, // 普通の床の上
  ]
};
