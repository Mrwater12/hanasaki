import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage11 = {
  id: 11,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.UP, // 1人目：右向き
      DIR.LEFT,
  ],

  map: [
    [3, 0, 0, 0, 3, 1],
    [0, 3, 8, 1, 1, 3],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [3, 0, 0, 1, 1, 7],
    [1, 2, 0, 0, 3, 1],
  ],
  objects: [
    { type: 'arrow', x: 0, y: 0, dir: 'RIGHT' },
    { type: 'arrow', x: 1, y: 1, dir: 'RIGHT' },
    { type: 'arrow', x: 4, y: 0, dir: 'UP' },
    { type: 'arrow', x: 5, y: 1, dir: 'DOWN' },
    { type: 'arrow', x: 0, y: 4, dir: 'UP' },
    { type: 'arrow', x: 4, y: 5, dir: 'RIGHT' },
    { type: 'switch', x: 5, y: 4, isPressed: false }
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 3, y: 5 }, // 普通の床の上
  ]
  
};