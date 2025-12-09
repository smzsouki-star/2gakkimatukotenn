// 🗄️ データ（fetchで取得）
let quizData = null;

// 🧠 ロジック
const QUIZ_COUNT = 5; // 出題数
let allQuestions = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswerIndex = null;

// DOM要素の取得
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const explanationScreen = document.getElementById('explanation-screen');

const startQuizBtn = document.getElementById('start-quiz-btn');
const showExplanationBtn = document.getElementById('show-explanation-btn');
const nextButton = document.getElementById('next-button');
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const reviewExplanationBtn = document.getElementById('review-explanation-btn');
const backToStartBtn = document.getElementById('back-to-start-btn');

const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const questionBox = document.getElementById('question-box');
const scoreText = document.getElementById('score-text');
const explanationContent = document.getElementById('explanation-content');

// --- 画面遷移関数 ---
function showScreen(screenId) {
    [startScreen, quizScreen, resultScreen, explanationScreen].forEach(screen => {
        if (screen) screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.add('active');
}

// --- クイズ開始処理 ---
function startQuiz() {
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        console.error("問題データがありません。");
        alert("問題データの読み込みに失敗しました。");
        return;
    }
    allQuestions = quizData.questions;
    score = 0;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;

    // 1. 問題をシャッフルし、5問を抽出
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    currentQuestions = shuffled.slice(0, QUIZ_COUNT);

    // 2. クイズ画面へ遷移し、最初の問題を表示
    showScreen('quiz-screen');
    loadQuestion();
}

// --- 問題の表示 ---
function loadQuestion() {
    selectedAnswerIndex = null;
    nextButton.disabled = true;
    nextButton.textContent = '解答する';
    nextButton.onclick = processAnswer;
    optionsList.innerHTML = '';

    // 以前の解説を完全に削除
    const oldRationales = questionBox.querySelectorAll('.rationale');
    oldRationales.forEach(rationale => {
        rationale.innerHTML = '';
        rationale.remove();
    });

    const q = currentQuestions[currentQuestionIndex];

    questionCounter.textContent = `第 ${currentQuestionIndex + 1} 問 / 全 ${QUIZ_COUNT} 問`;
    questionText.textContent = q.question;

    // 選択肢の描画
    q.options.forEach((optionText, index) => {
        const li = document.createElement('li');
        li.textContent = optionText;
        li.dataset.index = index;
        li.addEventListener('click', handleAnswerSelect);
        optionsList.appendChild(li);
    });
}

// --- 回答選択処理 ---
function handleAnswerSelect(event) {
    const selectedLi = event.target;
    const index = parseInt(selectedLi.dataset.index);

    // 選択状態をリセット
    optionsList.querySelectorAll('li').forEach(li => {
        li.classList.remove('selected');
    });

    // 新しい選択状態を設定
    selectedLi.classList.add('selected');
    selectedAnswerIndex = index;
    nextButton.disabled = false;
    nextButton.textContent = '解答する';
}

// --- 解答と次の問題への処理 ---
function processAnswer() {
    if (selectedAnswerIndex === null) return;

    const q = currentQuestions[currentQuestionIndex];
    const correctIndex = q.answer;
    const allOptions = optionsList.querySelectorAll('li');

    // 全ての選択肢のクリックイベントを解除（二重回答防止）
    allOptions.forEach(li => {
        li.removeEventListener('click', handleAnswerSelect);
    });

    // 正誤判定とスタイリング
    if (selectedAnswerIndex === correctIndex) {
        score++;
    }

    allOptions.forEach(li => {
        const index = parseInt(li.dataset.index);
        if (index === correctIndex) {
            li.classList.add('correct');
        } else if (index === selectedAnswerIndex) {
            li.classList.add('incorrect');
        }
    });

    // 解説の表示
    const rationaleDiv = document.createElement('div');
    rationaleDiv.classList.add('rationale');
    rationaleDiv.innerHTML = `<strong>【解説】</strong><br>${q.rationale}`;
    questionBox.appendChild(rationaleDiv);

    // 次へボタンの設定
    currentQuestionIndex++;
    if (currentQuestionIndex < QUIZ_COUNT) {
        nextButton.textContent = '次の問題へ';
        nextButton.onclick = nextQuestion;
    } else {
        nextButton.textContent = '結果を見る';
        nextButton.onclick = showResult;
    }
    nextButton.disabled = false;
}

// 6. 次の問題へ進む
function nextQuestion() {
    loadQuestion();
}

// 7. 結果表示
function showResult() {
    showScreen('result-screen');
    scoreText.textContent = `${QUIZ_COUNT}問中、${score}問正解でした！`;
}

// --- 解説ページの作成 ---
function createExplanationPage() {
    explanationContent.innerHTML = '';

    const explanationData = [
        {
            icon: '📜',
            title: '鴻門之会',
            subtitle: '漢文',
            source: 'テスト範囲',
            sections: [
                {
                    heading: '🪑 座席の順序',
                    points: [
                        '東向（項王/主人） - 最も尊い位置',
                        '南向（范増/次席） - 項王の補佐役',
                        '北向（沛公/客）　 - 客人の位置',
                        '西向（張良/陪席） - 最も低い位置'
                    ]
                },
                {
                    heading: '⚔️ 重要な場面',
                    points: [
                        '范増の合図：玉玦（ぎょくけつ）を三たび示し、劉邦殺害を促す',
                        '項荘の剣舞：剣舞と偽って劉邦を斬ろうとする',
                        '項伯の防御：身をもって劉邦をかばう'
                    ]
                },
                {
                    heading: '📖 重要句法',
                    points: [
                        '「然不自意、**能先入破秦**」→「思いもよらず、先に秦を破ることができた」（謙遜表現）',
                        '「不然、**何以至此**」→「そうでなければ、どうしてこのようなことになろうか」（反語）'
                    ]
                }
            ]
        },
        {
            icon: '🏹',
            title: '大鏡「弓争ひ」',
            subtitle: '古文',
            source: 'テスト範囲',
            sections: [
                {
                    heading: '👥 登場人物',
                    points: [
                        '入道殿　　（道長）- 弟、主人公',
                        '中の関白殿（道隆）- 兄',
                        '帥殿　　　（伊周）- 道隆の子、道長の甥'
                    ]
                },
                {
                    heading: '⚡ 争いの背景',
                    points: [
                        '道隆の死後、道長と伊周が**氏の長者・政権**の座を巡って対立',
                        '弓の腕前を競う場面で、政治的な運命が決まる'
                    ]
                },
                {
                    heading: '💬 重要な発言',
                    points: [
                        '**道長の宣言**：「道長が家より、帝・后立ち給ふべきものならば、この矢当たれ」',
                        '→ 神懸かり的な勝利宣言、権力掌握の野望を示す'
                    ]
                },
                {
                    heading: '😰 心理描写',
                    points: [
                        '伊周が「無辺世界」（的外れ）を射る',
                        '道隆は「**色青くなりぬ**」と絶望し、家門の衰退を予感'
                    ]
                },
                {
                    heading: '🗣️ 敬語表現',
                    points: [
                        '「申させ給うて」= 謙譲語 + 尊敬語 + 尊敬語',
                        '最高敬語の使用例として重要'
                    ]
                }
            ]
        }
    ];

    explanationData.forEach((data, index) => {
        // セクションカードの作成
        const sectionCard = document.createElement('div');
        sectionCard.classList.add('explanation-section');

        // ヘッダー部分
        const header = document.createElement('div');
        header.classList.add('section-header');
        header.innerHTML = `
            <div class="section-title-wrapper">
                <span class="section-icon">${data.icon}</span>
                <div>
                    <h3 class="section-title">${data.title}</h3>
                    <span class="section-subtitle">${data.subtitle}</span>
                </div>
            </div>
        `;
        sectionCard.appendChild(header);

        // 各サブセクション
        data.sections.forEach(section => {
            const subSection = document.createElement('div');
            subSection.classList.add('sub-section');

            const subHeading = document.createElement('h4');
            subHeading.classList.add('sub-heading');
            subHeading.textContent = section.heading;
            subSection.appendChild(subHeading);

            const pointsList = document.createElement('ul');
            pointsList.classList.add('points-list');

            section.points.forEach(point => {
                const li = document.createElement('li');
                // **text** を <strong>text</strong> に変換
                li.innerHTML = point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                pointsList.appendChild(li);
            });

            subSection.appendChild(pointsList);
            sectionCard.appendChild(subSection);
        });

        explanationContent.appendChild(sectionCard);
    });

    showScreen('explanation-screen');
}

// --- イベントリスナー設定 ---
startQuizBtn.addEventListener('click', startQuiz);
nextButton.addEventListener('click', processAnswer);
restartQuizBtn.addEventListener('click', startQuiz);

showExplanationBtn.addEventListener('click', createExplanationPage);
reviewExplanationBtn.addEventListener('click', createExplanationPage);
backToStartBtn.addEventListener('click', () => showScreen('start-screen'));

// 初回処理：データをフェッチする
document.addEventListener('DOMContentLoaded', () => {
    questionText.textContent = '問題データを読み込み中...';

    fetch('quiz_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            quizData = data;
            // データの読み込みが完了したらメッセージを更新
            if (quizData && quizData.questions && quizData.questions.length > 0) {
                // 最初の問題テキストを初期化（まだ開始前なので、ここは触らないほうがよいかもだが、元のコードに合わせる）
                // 元のコードではスタート画面がactiveなので、ここは裏側の処理。
                // スタートボタンが押せるようになったことを示すUI変更等はここでは特にしていない。
                console.log("Quiz data loaded successfully.");
            } else {
                questionText.textContent = 'エラー: 問題データが空です。';
            }
        })
        .catch(e => {
            console.error("データの読み込みに失敗しました: ", e);
            questionText.textContent = 'エラー: 問題データの読み込みに失敗しました。(ローカルファイルから直接開いている場合、ブラウザのセキュリティ制限により外部ファイルを読み込めないことがあります)';
        });

    showScreen('start-screen');
});
