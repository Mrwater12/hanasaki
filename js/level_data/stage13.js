import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage13 = {
  id:12,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  characters: [
    DIR.RIGHT,
    DIR.DOWN,
    DIR.UP,
  ],
  map: [
    [0, 2, 1, 1, 1, 7],
    [0, 0, 1, 1, 1, 0],
    [0, 3, 0, 0, 3, 0],
    [0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 0],
    [7, 0, 0, 0, 3, 0],
  ],
  objects: [
    { type: "arrow", x: 1, y: 2, dir: "UP" },
    { type: "arrow", x: 4, y: 2, dir: "RIGHT" },
    { type: "arrow", x: 4, y: 5, dir: "DOWN" },
    { type: "switch", x: 0, y: 5, dir: "UP" },
    { type: "switch", x: 5, y: 0, dir: "UP" },
  ],
  items: [
    { type: "can", x: 3, y: 5 },
  ]
  
};