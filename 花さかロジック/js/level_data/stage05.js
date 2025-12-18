import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage05 = {
  id: 5,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.LEFT, // 1人目：右向き
  ],

  map: [
    [4, 0, 1, 1, 1],
    [1, 0, 1, 1, 1],
    [1, 3, 0, 0, 4],
    [1, 0, 1, 1, 1],
    [1, 3, 0, 0, 2],  
  ],
  objects: [
    { type: 'warp', x: 0, y: 0, dir: 'RIGHT', color: 'magenta'},
    { type: 'warp', x: 4, y: 2, dir: 'LEFT' , color: 'magenta'},
    { type: 'arrow', x: 1, y: 2, dir: 'DOWN' },
    { type: 'arrow', x: 1, y: 4, dir: 'RIGHT' },
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 3, y: 2 }, // 普通の床の上
  ]
  
};