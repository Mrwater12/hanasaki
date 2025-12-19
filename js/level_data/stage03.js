import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage03 = {
  id: 3,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼

  map: [
    [1, 1, 3, 1, 2, 1],
    [1, 1, 0, 1, 0, 1], 
    [3, 0, 0, 0, 0, 2],
    [0, 1, 0, 1, 0, 1],
    [0, 0, 3, 0, 3, 1],
  ],
  characters: [
      DIR.UP,
      DIR.DOWN,
  ],
  objects: [
    { type: 'arrow', x: 2, y: 0, dir: 'DOWN' },
    { type: 'arrow', x: 0, y: 2, dir: 'RIGHT' },
    { type: 'arrow', x: 2, y: 4, dir: 'RIGHT' },
    { type: 'arrow', x: 4, y: 4, dir: 'UP' },
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 2, y: 2 },
    { type: 'can', x: 3, y: 4 }, // 普通の床の上
  ]

};