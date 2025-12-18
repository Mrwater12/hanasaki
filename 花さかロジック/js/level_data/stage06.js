import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage06 = {
  id: 6,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.UP, // 1人目：右向き
      DIR.UP,
  ],

  map: [
    [1, 1, 4, 1, 4, 1],
    [1, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 1],
    [3, 0, 0, 0, 3, 1],
    [0, 1, 0, 1, 0, 1],
    [2, 1, 3, 0, 0, 2],
  ],
  objects: [
    { type: 'warp', x: 2, y: 0, dir: 'DOWN', color: 'magenta'},
    { type: 'warp', x: 4, y: 0, dir: 'DOWN' , color: 'magenta'},
    { type: 'arrow', x: 0, y: 3, dir: 'DOWN' },
    { type: 'arrow', x: 2, y: 5, dir: 'RIGHT' },
    { type: 'arrow', x: 4, y: 3, dir: 'LEFT' },
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 4, y: 2 }, // 普通の床の上
    { type: 'can', x: 3, y: 5 },
  ]
  
};