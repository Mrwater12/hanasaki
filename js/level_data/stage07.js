import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage07 = {
  id: 7,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.UP, // 1人目：右向き
      DIR.DOWN,
  ],

  map: [
    [2, 0, 0, 0, 3],
    [0, 1, 0, 1, 0],
    [0, 1, 7, 1, 0],
    [0, 1, 0, 1, 0],
    [3, 0, 0, 0, 3],
  ],
  objects: [
    { type: 'arrow', x: 0, y: 4, dir: 'DOWN' },
    { type: 'arrow', x: 4, y: 0, dir: 'RIGHT' },
    { type: 'arrow', x: 4, y: 4, dir: 'LEFT' },
    { type: 'switch', x: 2, y: 2, isPressed: false },
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 4, y: 2 }, // 普通の床の上
  ]
  
};