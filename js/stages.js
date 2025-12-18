
export async function getStages() {
    const stageList = [];
    let i = 1;

    // ファイルが見つからなくなるまで無限に繰り返す
    while (true) {
        // 数字を2桁に揃える (1 -> "01", 10 -> "10")
        const num = String(i).padStart(2, '0');
        const fileName = `stage${num}`;

        try {
            // ファイルの読み込みを試みる
            const module = await import(`./level_data/${fileName}.js`);
            
            // 読み込み成功！
            // ファイル名と同じ変数名 (export const stage01 ...) を取得してリストに追加
            if (module[fileName]) {
                stageList.push(module[fileName]);
            }
            
            // 次の番号へ
            i++;
            
        } catch (error) {
            // ★重要: ファイルが見つからない(404)エラーが出たら、ここに来ます
            // これ以上ステージはないと判断してループを終了します
            break; 
        }
    }

    console.log(`全 ${stageList.length} ステージを読み込みました`);
    return stageList;
}