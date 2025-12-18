import { TILE, DIR } from './constants.js';

export class Game {
    constructor() {
        this.mapData = [];
        this.players = [];
        this.objects = [];
        this.items = [];
        this.state = 'EDIT'; // 'EDIT' or 'RUN'
        this.stageId = 0;
        this.stageConfig = null;
    }

    loadStage(stageConfig) {
        this.stageConfig = stageConfig;
        this.stageId = stageConfig.id;
        
        this.mapData = stageConfig.map.map(row => [...row]);
        this.objects = stageConfig.objects ? JSON.parse(JSON.stringify(stageConfig.objects)) : [];
        this.items = stageConfig.items ? JSON.parse(JSON.stringify(stageConfig.items)) : [];
        this.objects.forEach(obj => {
            if (obj.type === 'dragon') {
                obj.isActive = true; // 最初は火を吹いている
            }
            if (obj.type === 'fire_button') {
                obj.isPressed = false;
            }
        });
        this.players = [];

        // 配置ミス修正
        this.items = this.items.filter(item => {
            if (item.y < 0 || item.y >= this.mapData.length || item.x < 0 || item.x >= this.mapData[0].length) return false;
            const tile = this.mapData[item.y][item.x];
            if (tile === TILE.FLOWER || tile === TILE.NONE || tile === TILE.WARP) return false; 
            return true; 
        });

        this.state = 'EDIT';
    }

    tryAddPlayer(x, y) {
        if (this.state !== 'EDIT') return { success: false, msg: 'ゲーム中です' };
        if (y < 0 || y >= this.mapData.length || x < 0 || x >= this.mapData[0].length) return { success: false };
        if (this.mapData[y][x] !== 0) return { success: false, msg: "そこには置けません！" };
        const isOccupied = this.players.some(p => p.x === x && p.y === y);
        if (isOccupied) return { success: false, msg: "そこには誰かいます！" };
        const hasItem = this.items.some(item => item.x === x && item.y === y);
        if (hasItem) return { success: false, msg: "アイテムの上には置けません！" };
        if (this.players.length >= this.stageConfig.characters.length) return { success: false, msg: "もう全員置きました！" };
        if ([TILE.DRAGON, TILE.FIRE_BUTTON].includes(this.mapData[y][x])) {
            return { success: false, msg: "障害物の上には置けません！" };
        }
        
        const nextDir = this.stageConfig.characters[this.players.length];
        this.players.push({ 
            x: x, 
            y: y, 
            prevX: x, 
            prevY: y, 
            dir: nextDir, 
            hasCan: false,
            isWarping: false,
            warpDest: null,
            isFalling: false,
            // アニメーション制御用フラグ
            justWarped: false,
            isJumping: false,
            prevIsJumping: false // Viewでの描画判定用
        });

        return { success: true };
    }

    isReadyToStart() {
        return this.players.length === this.stageConfig.characters.length;
    }

    start() {
        if (this.isReadyToStart()) {
            this.state = 'RUN';
            return true;
        }
        return false;
    }

    getObjectAt(x, y) {
        return this.objects.find(o => o.x === x && o.y === y);
    }

    // ゲームの1ステップを進める
    update() {
        if (this.state !== 'RUN') return { status: 'STOP' };

        // 1. クリア判定
        if (this.players.length > 0 && this.players.every(p => p.isFinished)) {
            const cleared = this.checkAllFlowersBloomed();
            return { status: 'GAMEOVER', result: cleared, msg: cleared ? "クリア！すべての花が咲きました🌸" : "まだ咲いていない花があるよ..." };
        }
        for (let p of this.players) {
            p.prevX = p.x;
            p.prevY = p.y;
        }

        let isGameOver = false;
        let failMsg = "";

        // ▼▼▼ PHASE A: 到着イベント処理（前のターンの移動完了後の変化） ▼▼▼
        const fireTiles = this.calculateFireTiles();

        for (let p of this.players) {
            if (p.isFinished) continue;
            
            //トラップ炎処理
            if (!p.isJumping && fireTiles.some(f => f.x === p.x && p.y === f.y)) {
                isGameOver = true;
                failMsg = "アチチ！炎に焼かれました！";
                break;
            }

            // ワープ確定処理
            if (p.isWarping) {
                p.x = p.warpDest.x;
                p.y = p.warpDest.y;
                p.prevX = p.x; 
                p.prevY = p.y;
                if (p.warpDest.newDir) p.dir = p.warpDest.newDir;
                p.isWarping = false;
                p.justWarped = true; 
                continue; 
            } else {
                p.justWarped = false;
            }

            // 2) 落下確定処理
            if (p.isFalling) {
                this.mapData[p.y][p.x] = TILE.NONE;
                p.prevX = p.x;
                p.prevY = p.y;
                isGameOver = true; 
                failMsg = "バリッ！底が抜けて落ちました！"; 
            }

            if (isGameOver) break;

            // ★追加: 空中（ジャンプ中）なら足元のイベントはすべて無視する
            if (p.isJumping) continue;

            // 3) 足元のイベント処理
            
            // アイテム取得
            const foundItem = this.items.find(it => it.x === p.x && it.y === p.y);
            if (foundItem && foundItem.type === 'can') {
                p.hasCan = true;
                this.items = this.items.filter(it => it !== foundItem);
            }

            // ガラスのヒビ割れ
            if (this.mapData[p.y][p.x] === TILE.GLASS) {
                const glassObj = this.getObjectAt(p.x, p.y);
                if (glassObj && glassObj.isSafe === true) {
                    glassObj.isSafe = false; 
                }
            }

            if (this.mapData[p.y][p.x] === TILE.SWITCH) {
                const swObj = this.getObjectAt(p.x, p.y);
                
                // まだ押されていないスイッチなら発動
                if (swObj && !swObj.isPressed) {
                    swObj.isPressed = true; // 状態を「押下済み」に
                    this.flipAllArrows();   // 全矢印を反転
                }
                
                // スイッチに乗ったらアニメーションと状態を完全に停止させる
                p.isFinished = true;
                p.isJumping = false; // ジャンプフラグ解除
                p.prevX = p.x;       // 現在地を固定（無限ジャンプ防止）
                p.prevY = p.y;
            }
            
        }

        if (isGameOver) return { status: 'GAMEOVER', result: false, msg: failMsg };


        // ▼▼▼ PHASE B: 次の移動先の計算 ▼▼▼
        
        // アニメーション用
        for (let p of this.players) {
            p.prevIsJumping = p.isJumping;
            p.isMovingWithFloor = false;
        }

        for (let p of this.players) {
            if (p.isFinished) continue;
            if (p.justWarped) continue;
            if (this.mapData[p.y][p.x] === TILE.MOVING_FLOOR) {
                // 1. 進行方向の確認
                const dx = p.dir.x;
                const dy = p.dir.y;
                const nextX = p.x + dx;
                const nextY = p.y + dy;

                // 画面外チェック
                if (nextY >= 0 && nextY < this.mapData.length && nextX >= 0 && nextX < this.mapData[0].length) {
                    // 2. 進行方向が「穴(NONE)」であるか？
                    if (this.mapData[nextY][nextX] === TILE.NONE) {
                        
                        // 3. 衝突チェック（移動先に誰かいるか、または対向してくるか）
                        // ※既存の衝突判定は移動後に行われますが、床の移動はマップを書き換えるため事前にチェックします
                        let collision = false;
                        for (let other of this.players) {
                            if (other === p) continue;
                            
                            // A: 既に移動先に誰かいる
                            if (other.x === nextX && other.y === nextY) collision = true;
                            
                            // B: 対向衝突 (相手もこちらに来ようとしている)
                            // 相手も平行移動床に乗っていて、かつ逆方向を向いている場合などを想定
                            if (other.x === nextX && other.y === nextY && 
                                other.dir.x === -dx && other.dir.y === -dy) {
                                collision = true;
                            }
                        }

                        if (collision) {
                            // ぶつかるので動けない -> そのまま通常の移動処理へ（結果的に穴へ落ちてGAMEOVER or 衝突判定）
                            // ここでは何もしないで下に流す
                        } else {
                            // ★ 移動実行 ★
                            
                            // A. マップデータのスワップ
                            // 元いた場所 -> 穴(NONE)
                            this.mapData[p.y][p.x] = TILE.NONE;
                            // 移動先 -> 床(MOVING_FLOOR)
                            this.mapData[nextY][nextX] = TILE.MOVING_FLOOR;

                            // B. プレイヤー座標の更新
                            p.x = nextX;
                            p.y = nextY;

                            p.isMovingWithFloor = true;

                            // C. 特別フラグ（このターンはこれ以上通常の歩行移動をしない）
                            // 通常移動ロジックをスキップするために continue しますが、
                            // その前に衝突判定用に prevX などを維持しているのでOK
                            continue; 
                        }
                    }
                }
            }

            // --- パターンA: 既にジャンプ中（空中）の時 ---
            // 滞空しているので、次は「着地」の処理を行う
            if (p.isJumping) {
                // 着地点（現在地＝空中から、さらに1マス先）
                const landX = p.x + p.dir.x;
                const landY = p.y + p.dir.y;
                
                p.x = landX;   
                p.y = landY;
                
                p.isJumping = false; // ジャンプ終了（着地）

                // 画面外・穴判定
                if (landY < 0 || landY >= this.mapData.length || landX < 0 || landX >= this.mapData[0].length) {
                    isGameOver = true; failMsg = "場外へ飛んでいきました！"; 
                    continue; 
                }
                // 通常の移動チェックだとNONEで死ぬが、着地時はここで判定
                if (this.mapData[landY][landX] === TILE.NONE) {
                    isGameOver = true; failMsg = "穴に落ちちゃった！"; 
                    continue; 
                }
                continue; // 移動完了
            }

            // --- パターンB: ジャンプ台に乗っている時 ---
            if (this.mapData[p.y][p.x] === TILE.SPRING) {
                // 中間地点（1マス先＝空中）へ移動
                const midX = p.x + p.dir.x;
                const midY = p.y + p.dir.y;

                // ワープゲート衝突判定
                const midObj = this.getObjectAt(midX, midY);
                if (this.mapData[midY][midX] === TILE.WARP || (midObj && midObj.type === 'warp')) {
                    isGameOver = true; failMsg = "ワープゲートにはぶつかってしまいます！"; 
                    continue; 
                }

                // 「空中」へ移動
                p.x = midX;
                p.y = midY;
                
                p.isJumping = true; // ジャンプ開始（滞空モードへ）

                // 画面外判定（中間地点）
                if (midY < 0 || midY >= this.mapData.length || midX < 0 || midX >= this.mapData[0].length) {
                    isGameOver = true; failMsg = "壁に激突しました！"; 
                    continue; 
                }
                
                continue; // 移動完了
            }

            // --- パターンC: 通常移動 ---
            // 方向転換
            const arrowObj = this.getObjectAt(p.x, p.y);
            if (arrowObj && arrowObj.type === 'arrow' && arrowObj.dir) {
                const d = arrowObj.dir;
                if (d === 'UP' || d.y === -1) p.dir = DIR.UP;
                else if (d === 'RIGHT' || d.x === 1) p.dir = DIR.RIGHT;
                else if (d === 'DOWN' || d.y === 1) p.dir = DIR.DOWN;
                else if (d === 'LEFT' || d.x === -1) p.dir = DIR.LEFT;
            }

            // 移動先計算
            const nextX = p.x + p.dir.x;
            const nextY = p.y + p.dir.y;

            // 画面外判定
            if (nextY < 0 || nextY >= this.mapData.length || nextX < 0 || nextX >= this.mapData[0].length) {
                p.x = nextX; p.y = nextY;
                isGameOver = true; failMsg = "穴に落ちちゃった！";
                continue; 
            }
            if (this.mapData[nextY][nextX] === TILE.DRAGON) {
                // 壁と同じ扱いで進めない（その場で待機）
                continue; 
            }

            // 2. 解除ボタンへの接触判定
            if (this.mapData[nextY][nextX] === TILE.FIRE_BUTTON) {
                const btnObj = this.getObjectAt(nextX, nextY);
                if (btnObj) {
                    // ボタンがまだ押されていないなら押す
                    if (!btnObj.isPressed) {
                        btnObj.isPressed = true;
                        
                        // ペアになる色のドラゴンの炎を消す
                        this.deactivateDragons(btnObj.color);
                        
                        // アクション実行: 移動はせず、その場で完了状態になる
                        p.isFinished = true; 
                        continue; 
                    } else {
                        // 既に押されているボタンはただの壁（障害物）
                        continue;
                    }
                }
            }
            
            // 壁・障害物判定
            let canMove = true;
            const nextTile = this.mapData[nextY][nextX];
            
            if (canMove) {
                const itemAtNext = this.items.find(it => it.x === nextX && it.y === nextY);
                if (p.hasCan && itemAtNext && itemAtNext.type === 'can') canMove = false;
            }

            if (!canMove) {
                continue; 
            }

            // 地形ごとの移動結果

            if (nextTile === TILE.NONE) {
                p.x = nextX; p.y = nextY;
                isGameOver = true; failMsg = "穴に落ちちゃった！"; 
                continue; 
            }
            else if (nextTile === TILE.FLOWER) {
                if (p.hasCan) {
                    // 水がある場合：手前で水をやる（移動しない）
                    this.mapData[nextY][nextX] = TILE.EMPTY; 
                    p.isFinished = true;
                } else {
                    isGameOver = true; 
                    failMsg = "水がありません！"; 
                    continue; 
                }
            }
            else if (nextTile === TILE.GLASS) {
                const glassObj = this.getObjectAt(nextX, nextY);
                p.x = nextX; p.y = nextY;

                if (glassObj && glassObj.isSafe === false) {
                    p.isFalling = true;
                }
            }
            else if (nextTile === TILE.WARP) {
                const warpObj = this.getObjectAt(nextX, nextY);
                let isEnterable = false;
                if (warpObj && warpObj.dir) {
                    const wd = warpObj.dir;
                    const pd = p.dir;
                    if ((wd === 'UP' || wd.y === -1) && pd.y === 1) isEnterable = true;
                    else if ((wd === 'RIGHT' || wd.x === 1) && pd.x === -1) isEnterable = true;
                    else if ((wd === 'DOWN' || wd.y === 1) && pd.y === -1) isEnterable = true;
                    else if ((wd === 'LEFT' || wd.x === -1) && pd.x === 1) isEnterable = true;
                }

                if (isEnterable) {
                    const destWarp = this.objects.find(o => 
                        o.type === 'warp' && 
                        o.color === warpObj.color && 
                        (o.x !== nextX || o.y !== nextY)
                    );
                    if (destWarp) {
                        p.x = nextX; p.y = nextY;
                        p.isWarping = true; 
                        
                        let newDir = null; 
                        if (destWarp.dir) {
                            const wd = destWarp.dir;
                            if (wd === 'UP' || wd.y === -1) newDir = DIR.UP;
                            else if (wd === 'RIGHT' || wd.x === 1) newDir = DIR.RIGHT;
                            else if (wd === 'DOWN' || wd.y === 1) newDir = DIR.DOWN;
                            else if (wd === 'LEFT' || wd.x === -1) newDir = DIR.LEFT;
                        }
                        p.warpDest = { x: destWarp.x, y: destWarp.y, newDir: newDir };
                    } else {
                        p.x = nextX; p.y = nextY;
                    }
                } else {
                    isGameOver = true; failMsg = "ぶつかりました！"; 
                    continue;
                }
            } else {
                p.x = nextX; p.y = nextY;
            }
        }

        // 3. 衝突判定
        if (!isGameOver) {
            for (let i = 0; i < this.players.length; i++) {
                for (let j = i + 1; j < this.players.length; j++) {
                    const p1 = this.players[i];
                    const p2 = this.players[j];
                    if (p1.x < 0 || p2.x < 0) continue;
                    const isSamePos = (p1.x === p2.x && p1.y === p2.y);
                    const isSwap = (p1.x === p2.prevX && p1.y === p2.prevY && p2.x === p1.prevX && p2.y === p1.prevY);
                    if (isSamePos) return { status: 'GAMEOVER', type: 'CRASH', result: false, msg: "ぶつかった！" }; 
                    else if (isSwap) return { status: 'GAMEOVER', type: 'SWAP', result: false, msg: "ぶつかった！" };
                    
                    // ※ ジャンプも1マスずつになったので、中間地点計算は不要になりました
                }
            }
        }

        if (isGameOver) {
            return { status: 'GAMEOVER', result: false, msg: failMsg };
        }

        return { status: 'CONTINUE' };
    }
    calculateFireTiles() {
        const fireTiles = [];
        const dragons = this.objects.filter(o => o.type === 'dragon' && o.isActive);

        dragons.forEach(d => {
            // 文字列定義とオブジェクト定義の両方に対応してベクトル化
            let dx = 0, dy = 0;
            const dir = d.dir;
            if (dir === 'UP' || dir.y === -1) { dx = 0; dy = -1; }
            else if (dir === 'RIGHT' || dir.x === 1) { dx = 1; dy = 0; }
            else if (dir === 'DOWN' || dir.y === 1) { dx = 0; dy = 1; }
            else if (dir === 'LEFT' || dir.x === -1) { dx = -1; dy = 0; }

            // 3マス分チェック
            for (let i = 1; i <= 3; i++) {
                const tx = d.x + dx * i;
                const ty = d.y + dy * i;

                // 画面外ならストップ
                if (ty < 0 || ty >= this.mapData.length || tx < 0 || tx >= this.mapData[0].length) break;

                // 壁・障害物があれば炎はそこで止まる
                const tile = this.mapData[ty][tx];
                // 炎が貫通するもの: EMPTY(0), NONE(1), FLOWER(2), SWITCH(7), MOVING_FLOOR(8), ARROW(3)
                // 炎が止まるもの: WARP(4), GLASS(5), SPRING(6), DRAGON(10), FIRE_BUTTON(11)
                // ※この辺りの貫通ルールはお好みで調整してください
                if ([TILE.WARP, TILE.GLASS, TILE.SPRING, TILE.DRAGON, TILE.FIRE_BUTTON].includes(tile)) {
                    break;
                }

                // リストに追加 (描画用に方向と先端フラグも持たせる)
                fireTiles.push({ 
                    x: tx, 
                    y: ty, 
                    color: d.color || 'red', 
                    dir: {x:dx, y:dy}, 
                    isStart: (i === 1),
                    isTip: (i === 3) 
                });
            }
        });
        return fireTiles;
    }

    checkAllFlowersBloomed() {
        let flowersRemaining = 0;
        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                if (this.mapData[y][x] === TILE.FLOWER) {
                    flowersRemaining++;
                }
            }
        }
        return flowersRemaining === 0;
    }
    flipAllArrows() {
        this.objects.forEach(obj => {
            if (obj.type === 'arrow' && obj.dir) {
                // 向きの反転処理
                const d = obj.dir;
                let newDir = d;

                // 文字列定義とオブジェクト定義の両方に対応
                if (d === 'UP' || d.y === -1) newDir = 'DOWN';
                else if (d === 'DOWN' || d.y === 1) newDir = 'UP';
                else if (d === 'RIGHT' || d.x === 1) newDir = 'LEFT';
                else if (d === 'LEFT' || d.x === -1) newDir = 'RIGHT';

                obj.dir = newDir;
                
                // ★見た目変更用フラグ: 一度でも変更されたら黄色く光らせる
                obj.isHighlighted = true;
            }
        });
    }
    deactivateDragons(targetColor) {
        this.objects.forEach(obj => {
            // 色が一致するドラゴンの isActive を false にする
            if (obj.type === 'dragon' && obj.color === targetColor) {
                obj.isActive = false; 
            }
        });
    }
}