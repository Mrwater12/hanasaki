import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage08 = {
  id: 8,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.UP, // 1人目：右向き
      DIR.DOWN,
  ],

  map: [
    [4, 1, 3, 0, 4],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [3, 1, 0, 1, 7],
    [0, 1, 2, 1, 0],
  ],
  objects: [
    { type: 'arrow', x: 0, y: 3, dir: 'UP' },
    { type: 'arrow', x: 2, y: 0, dir: 'UP' },
    { type: 'switch', x: 4, y: 3, isPressed: false },
    { type: 'warp', x: 0, y: 0, dir: 'DOWN', color: 'magenta'},
    { type: 'warp', x: 4, y: 0, dir: 'LEFT', color: 'magenta'},
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 0, y: 2 }, // 普通の床の上
  ]
  
};