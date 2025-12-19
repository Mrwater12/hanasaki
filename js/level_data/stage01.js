import { TILE, DIR } from '../constants.js';

export const stage01 = {
  id: 1,
 
  // 21x12マスの広大なステージ
  map: [
    [0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0],
  ],

  characters: [
      DIR.LEFT  // 1人目：下向き（dir1）
  ],
  objects: [],

  // Layer 3: アイテム（拾えるもの）
  items: [
    { type: 'can', x: 2, y: 1 }, // 普通の床の上
  ]
};
