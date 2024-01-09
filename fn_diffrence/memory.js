const fs = require('fs');

// アロー関数
const arrowFunction = () => {
    let largeArray = Array(1000000).fill(0).map((_, i) => i * 2);
    return largeArray.reduce((acc, val) => acc + val, 0);
};

// 通常の関数
function regularFunction() {
    let largeArray = Array(1000000).fill(0).map((_, i) => i * 2);
    return largeArray.reduce((acc, val) => acc + val, 0);
};

// メモリ使用量を測定する関数
function measureMemoryUsage(fn) {
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    fn();
    const finalMemoryUsage = process.memoryUsage().heapUsed;
    return finalMemoryUsage - initialMemoryUsage;
}

// 実行組み合わせを作成する関数
function generateCombinations(n, currentCombination = [], allCombinations = []) {
    if (currentCombination.length === n) {
        allCombinations.push([...currentCombination]);
        return;
    }

    ['arrow', 'regular'].forEach(functionType => {
        currentCombination.push(functionType);
        generateCombinations(n, currentCombination, allCombinations);
        currentCombination.pop();
    });

    return allCombinations;
}

let testCounts = process.argv[2] ? parseInt(process.argv[2], 10) : 3;
const allCombinations = generateCombinations(testCounts);

// 測定結果を保存するための配列
let arrowFunctionResults = [];
let regularFunctionResults = [];

// 測定を複数回行う
for (let i = 0; i < 10; i++) {
    // ランダムな組み合わせを選択
    const randomIndex = Math.floor(Math.random() * allCombinations.length);
    const chosenCombination = allCombinations[randomIndex];

    // メモリ使用量を測定
    let memoryUsagesArrow = [];
    let memoryUsagesRegular = [];
    chosenCombination.forEach(functionType => {
        if (functionType === 'arrow') {
            memoryUsagesArrow.push(measureMemoryUsage(arrowFunction));
        } else {
            memoryUsagesRegular.push(measureMemoryUsage(regularFunction));
        }
    });

    // 平均値を計算し、結果を保存
    const averageMemoryUsageArrow = memoryUsagesArrow.reduce((a, b) => a + b, 0) / memoryUsagesArrow.length;
    const averageMemoryUsageRegular = memoryUsagesRegular.reduce((a, b) => a + b, 0) / memoryUsagesRegular.length;
    arrowFunctionResults.push(averageMemoryUsageArrow);
    regularFunctionResults.push(averageMemoryUsageRegular);
}

// 結果を出力
console.log('Arrow Function Memory Usage Results:', arrowFunctionResults);
console.log('Regular Function Memory Usage Results:', regularFunctionResults);

// JSONファイルに結果を出力
const results = {
    arrowFunctionResults: arrowFunctionResults,
    regularFunctionResults: regularFunctionResults
};

const randomNum = Math.floor(Math.random() * 10000);
const fileName = `memoryUsageResults_${randomNum}.json`;

fs.writeFile(fileName, JSON.stringify(results, null, 2), (err) => {
    if (err) throw err;
    console.log('Memory usage results have been saved to "memoryUsageResults.json"');
});
