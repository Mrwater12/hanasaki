import { TILE, DIR } from './constants.js';
import { getStages } from './stages.js';
import { Game } from './game.js';
import { View } from './view.js';

// 設定定数
const NORMAL_SPEED = 350;    
const SLOW_SPEED = 500;    

// インスタンス作成
const game = new Game();
const view = new View();

// グローバル変数
let currentStageIndex = 0; 
let currentSpeed = NORMAL_SPEED;
let lastUpdateTime = 0;
let animationId = null;
let animationLimit = 1.0;

let stages = [];

// --- 管理者メニュー用 DOM取得 (Viewの外で管理してもOK) ---
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const loadCustomStageBtn = document.getElementById('loadCustomStageBtn');
const stageInput = document.getElementById('stageInput');
const resetBtn = document.getElementById('resetBtn');

async function init() {

    if (stages.length === 0) {
        stages = await getStages();
    }
    const currentStage = stages[currentStageIndex];
    view.renderStageList(stages);
    
    // ゲームロジック初期化
    game.loadStage(currentStage);

    // ビュー初期化
    view.initCanvas(game.mapData);
    view.updateStageInfo(currentStageIndex, stages.length, currentStage.id);
    updateGameUI();

    if (!animationId) {
        renderLoop();
    }
}

function updateGameUI() {
    // 状態メッセージ更新
    const maxChars = game.stageConfig.characters.length;
    const placedChars = game.players.length;
    
    if (game.state === 'EDIT') {
        if (placedChars < maxChars) {
            view.updateStatus("マスをクリックしてキャラを置いてね");
        } else {
            view.updateStatus("準備完了！スタートを押してね");
        }
        view.enableStartBtn(placedChars === maxChars);
    }
    
    view.updateCharQueue(game.stageConfig.characters, placedChars);
}

// ゲームループ
function gameLoop() {
    if (game.state !== 'RUN') return;

    lastUpdateTime = Date.now();
    
    // ゲームロジックを1ステップ進める
    const result = game.update();

    // 誰かが移動したかチェック (前の座標と今の座標を比較)
    const anyoneMoved = game.players.some(p => p.x !== p.prevX || p.y !== p.prevY);

    //  デフォルトの待ち時間
    let stepTime = currentSpeed;
    animationLimit = 1.0;
    
    // ★修正: ジャンプ中も時間を変えずに、全員同じリズムで動かす

    //  移動が発生していない場合（花への水やり等）は待ち時間を短くする
    if (!anyoneMoved) {
        stepTime = 100; // 0.1秒だけ待つ（サクサク進むように）
    }

    // GAMEOVER（クリア含む）時の処理
    if (result.status === 'GAMEOVER') {
        
        // 「すれ違い(SWAP)」の場合は、時間半分 & 描画は50%で止める
        if (result.type === 'SWAP') {
            stepTime = currentSpeed / 2;
            animationLimit = 0.5; 
        }

        setTimeout(() => {

            if (result.type === 'SWAP') {
                game.players.forEach(p => {
                    p.x = p.prevX;
                    p.y = p.prevY;
                });
            }
            // ゲーム停止
            game.state = 'EDIT'; 
            animationLimit = 1.0;
            // animationLimit の位置で描画を止める
            view.draw(game, animationLimit); 

            // メッセージを表示
            view.updateStatus(result.msg, result.result, false);

        }, stepTime); // 計算した stepTime 待つ
        
        return; 
    }

    // 次のループも stepTime 待つ
    setTimeout(gameLoop, stepTime);
}

function renderLoop() {
    let progress = 0;
    
    if (game.state === 'RUN') {
        const now = Date.now();
        const elapsed = now - lastUpdateTime;
        
        // ★修正: 常に一定の速度で計算する
        let duration = currentSpeed;

        progress = elapsed / duration;
        
        if (progress > 1.0) progress = 1.0;

        //  SWAP時などに指定位置以上動かないように制限する
        if (progress > animationLimit) progress = animationLimit;

    } else {
        progress = 1.0;
    }

    view.draw(game, progress);
    animationId = requestAnimationFrame(renderLoop);
}

// --- イベントリスナー ---

view.startBtn.addEventListener('click', () => {
    if (game.start()) {
        view.updateStatus("移動中...", null, true);
        gameLoop();
    }
});

resetBtn.addEventListener('click', () => {
    init();
});

view.prevStageBtn.addEventListener('click', () => {
    if (currentStageIndex > 0) {
        currentStageIndex--;
        init();
    }
});

view.nextStageBtn.addEventListener('click', () => {
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        init();
    }
});

view.slowBtn.addEventListener('click', () => {
    if (currentSpeed === NORMAL_SPEED) {
        currentSpeed = SLOW_SPEED;
        view.updateSlowBtn(true);
    } else {
        currentSpeed = NORMAL_SPEED;
        view.updateSlowBtn(false);
    }
});

view.canvas.addEventListener('click', (e) => {
    const pos = view.getGridFromScreen(e.clientX, e.clientY);
    
    const result = game.tryAddPlayer(pos.x, pos.y);
    if (!result.success && result.msg) {
        view.updateStatus(result.msg);
    } else {
        updateGameUI();
    }
    view.draw(game);
});
view.stageSelect.addEventListener('change', (e) => {
    // 文字列として返ってくるので数値に変換
    currentStageIndex = parseInt(e.target.value, 10);
    init();
});

// 管理者メニュー
adminBtn.addEventListener('click', () => adminModal.style.display = 'flex');
closeAdminBtn.addEventListener('click', () => adminModal.style.display = 'none');
loadCustomStageBtn.addEventListener('click', () => {
    const inputStr = stageInput.value;
    if (!inputStr) return alert("データが空です");
    try {
        const customData = JSON.parse(inputStr);
        if (!customData.map || !customData.characters) return alert("形式エラー");

        const convertedChars = customData.characters.map(dirName => {
            if (dirName === "UP") return DIR.UP;
            if (dirName === "DOWN") return DIR.DOWN;
            if (dirName === "LEFT") return DIR.LEFT;
            if (dirName === "RIGHT") return DIR.RIGHT;
            return DIR.DOWN; 
        });

        stages.push({
            id: 999,
            characters: convertedChars,
            map: customData.map,
            objects: customData.objects || [],
            items: customData.items || [],
        });
        currentStageIndex = stages.length - 1; 
        adminModal.style.display = 'none';
        alert("カスタムステージを読み込みました！");
        init();
    } catch (e) {
        alert("JSONエラー: " + e.message);
    }
});

// 実行開始
init();