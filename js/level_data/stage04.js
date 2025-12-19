import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage04 = {
  id: 4,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
      DIR.LEFT, // 1人目：右向き
  ],

  map: [
    [4, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 2, 0, 0, 4],    
  ],
  objects: [
    { type: 'warp', x: 0, y: 0, dir: 'RIGHT', color: 'magenta'},
    { type: 'warp', x: 6, y: 2, dir: 'LEFT' , color: 'magenta'},
  ],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 3, y: 0 }, // 普通の床の上
  ]
  
};