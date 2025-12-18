import { TILE, DIR } from '../constants.js';

//変数名も変更
export const stage12 = {
  id:12,
  // ▼▼▼ 2人のキャラを定義 ▼▼▼
  {
  map: [
    [
      1,
      0,
      3,
      1,
      0,
      0,
      3
    ],
    [
      1,
      1,
      8,
      1,
      1,
      1,
      0
    ],
    [
      1,
      1,
      1,
      1,
      1,
      1,
      0
    ],
    [
      2,
      1,
      1,
      0,
      0,
      3,
      0
    ],
    [
      1,
      0,
      8,
      1,
      1,
      0,
      3
    ],
    [
      1,
      1,
      1,
      1,
      1,
      0,
      0
    ],
    [
      1,
      0,
      3,
      0,
      0,
      3,
      7
    ]
  ],
  objects: [
    {
      type: "arrow",
      x: 2,
      y: 0,
      dir: "DOWN"
    },
    {
      type: "arrow",
      x: 6,
      y: 0,
      dir: "DOWN"
    },
    {
      type: "arrow",
      x: 5,
      y: 3,
      dir: "RIGHT"
    },
    {
      type: "arrow",
      x: 6,
      y: 4,
      dir: "DOWN"
    },
    {
      type: "arrow",
      x: 5,
      y: 6,
      "dir": "DOWN"
    },
    {
      type: "arrow",
      x: 2,
      y: 6,
      dir: "RIGHT"
    },
    {
      type: "switch",
      x: 6,
      y: 6,
      dir: "UP"
    }
  ],
  items: [
    {
      type: "can",
      x: 4,
      y: 6
    }
  ],
  characters: [
    "RIGHT",
    "RIGHT"
  ]
}
  
};
