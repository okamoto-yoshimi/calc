document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const clearButton = document.getElementById('clear');
    const equalsButton = document.getElementById('equals');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');

    let currentInput = '0'; // 現在入力されている数値
    let firstOperand = null; // 最初のオペランド（数値）
    let operator = null; // 選択された演算子
    let waitingForSecondOperand = false; // 2つ目のオペランドを待っている状態か

    // ディスプレイを更新する関数
    function updateDisplay() {
        display.textContent = currentInput;
    }

    // 数字ボタンがクリックされた時の処理
    numberButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const number = event.target.dataset.number;

            if (waitingForSecondOperand === true) {
                currentInput = number;
                waitingForSecondOperand = false;
            } else {
                // 最初の入力が '0' かつ、小数点でない場合
                if (currentInput === '0' && number !== '.') {
                    currentInput = number;
                } else if (number === '.' && currentInput.includes('.')) {
                    // 既に小数点が含まれている場合は何もしない
                    return;
                } else {
                    currentInput += number;
                }
            }
            updateDisplay();
        });
    });

    // 演算子ボタンがクリックされた時の処理
    operatorButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const nextOperator = event.target.dataset.operator;
            const inputValue = parseFloat(currentInput);

            if (firstOperand === null && !isNaN(inputValue)) {
                firstOperand = inputValue;
            } else if (operator) {
                // 複数の演算子が連続して入力された場合、直前の計算を実行
                const result = calculate(firstOperand, inputValue, operator);
                currentInput = String(result);
                firstOperand = result;
            }

            operator = nextOperator;
            waitingForSecondOperand = true; // 次の数字入力を待つ
            updateDisplay(); // オペランドが更新されたことを表示
        });
    });

    // 等号ボタンがクリックされた時の処理
    equalsButton.addEventListener('click', () => {
        if (firstOperand === null || operator === null || waitingForSecondOperand) {
            // 計算に必要な情報が揃っていない場合は何もしない
            return;
        }

        const secondOperand = parseFloat(currentInput);
        const result = calculate(firstOperand, secondOperand, operator);

        currentInput = String(result);
        firstOperand = null; // 計算終了後、リセット
        operator = null;
        waitingForSecondOperand = false; // 結果が表示されている状態
        updateDisplay();
    });

    // クリアボタンがクリックされた時の処理
    clearButton.addEventListener('click', () => {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    });

    // 2つのオペランドと演算子を使って計算を実行する関数
    function calculate(first, second, op) {
        switch (op) {
            case '+':
                return first + second;
            case '-':
                return first - second;
            case '*':
                return first * second;
            case '/':
                if (second === 0) {
                    alert("0で割ることはできません！");
                    return 0; // またはエラーメッセージを表示
                }
                return first / second;
            default:
                return second;
        }
    }

    // 初期表示
    updateDisplay();
});
