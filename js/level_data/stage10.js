import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage10 = {
  id: 10,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.DOWN, // 1人目：右向き
      DIR.RIGHT,
  ],

  map: [
    [1, 1, 0 ,1, 4, 0, 1],
    [0, 0, 8 ,1, 1, 0, 4],
    [1, 1, 1 ,1, 1, 0, 1],
    [1, 1, 1 ,1, 1, 0, 1],
    [1, 0, 0 ,1, 1, 0, 1],
    [1, 2, 0 ,0, 0, 3, 1],
    [1, 1, 2 ,0, 3, 0, 1],
  ],
  objects: [
    { type: 'arrow', x: 4, y: 6, dir: 'LEFT' },
    { type: 'arrow', x: 5, y: 5, dir: 'LEFT' },
    { type: 'warp', x: 4, y: 0, dir: 'DOWN', color: 'magenta'},
    { type: 'warp', x: 6, y: 1, dir: 'LEFT', color: 'magenta'},
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 5, y: 1 }, // 普通の床の上
    { type: 'can', x: 2, y: 5 },
  ]
  
};