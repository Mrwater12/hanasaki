import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage14 = {
  id:14,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  map: [
    [3, 0, 3, 0, 0, 0, 3],
    [0, 1, 0, 1, 7, 1, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [3, 0, 0, 0, 0, 1, 2],
    [1, 1, 1, 1, 1, 1, 1],
    [7, 0, 1, 1, 8, 0, 0],
    [1, 0, 3, 0, 0, 0, 0]
  ],
  objects: [
    { type: "arrow", x: 0, y: 3, dir: "DOWN" },
    { type: "arrow", x: 0, y: 0, dir: "LEFT" },
    { type: "arrow", x: 2, y: 0, dir: "RIGHT" },
    { type: "arrow", x: 6, y: 0, dir: "DOWN" },
    { type: "arrow", x: 2, y: 6, dir: "DOWN" },
    { type: "switch", x: 4, y: 1, dir: "UP" },
    { type: "switch", x: 0, y: 5, dir: "UP" }
  ],
  items: [
    { type: "can", x: 2, y: 3 }
  ],
  characters: [
    DIR.UP,
    DIR.LEFT,
    DIR.LEFT
  ]
};