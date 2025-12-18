import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage09 = {
  id: 9,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.UP, // 1人目：右向き
  ],

  map: [
    [1, 1, 3, 0, 3, 1],
    [3, 0, 0, 0, 1, 2],
    [0, 1, 0, 1, 1, 1],
    [0, 1, 0, 1, 8, 1],
    [3, 0, 3, 1, 0, 1],
    [0, 1, 1, 1, 0, 1],
  ],
  objects: [
    { type: 'arrow', x: 0, y: 1, dir: 'RIGHT' },
    { type: 'arrow', x: 2, y: 0, dir: 'DOWN' },
    { type: 'arrow', x: 4, y: 0, dir: 'LEFT' },
    { type: 'arrow', x: 0, y: 4, dir: 'UP' },
    { type: 'arrow', x: 2, y: 4, dir: 'LEFT' },
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 0, y: 3 }, // 普通の床の上
  ]
  
};