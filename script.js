// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // ----- DOM Elements -----
    const resultField = document.getElementById('result');
    const buttons = document.querySelectorAll('button');
    const clearBtn = document.getElementById('clear');
    const backspaceBtn = document.getElementById('backspace');
    const equalsBtn = document.getElementById('equals');
    const decimalBtn = document.getElementById('decimal');

    // ----- State Variables -----
    let currentInput = '';      // What's currently being typed (display)
    let previousInput = '';     // Stored first operand
    let operator = null;        // Current operator
    let shouldResetInput = false; // Flag to reset input after operator

    // ----- Helper: Update display -----
    function updateDisplay(value) {
        resultField.value = value || '0';
    }

    // ----- Helper: Perform calculation -----
    function calculate() {
        if (operator === null || previousInput === '' || currentInput === '') return;

        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;

        let result;
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error'; // Division by zero
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }

        // Handle floating point precision
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
        }

        currentInput = result.toString();
        operator = null;
        previousInput = '';
        shouldResetInput = true; // Next digit will start fresh
        updateDisplay(currentInput);
    }

    // ----- Handle Number Input -----
    function inputNumber(num) {
        if (shouldResetInput) {
            currentInput = '';
            shouldResetInput = false;
        }
        // Prevent multiple leading zeros? Not strictly necessary, but keep it simple.
        currentInput += num;
        updateDisplay(currentInput);
    }

    // ----- Handle Decimal Point -----
    function inputDecimal() {
        if (shouldResetInput) {
            currentInput = '';
            shouldResetInput = false;
        }
        // Prevent multiple decimals
        if (!currentInput.includes('.')) {
            currentInput += currentInput === '' ? '0.' : '.';
            updateDisplay(currentInput);
        }
    }

    // ----- Handle Operator -----
    function handleOperator(op) {
        if (currentInput === '' && previousInput === '') return; // Nothing to operate on

        if (previousInput !== '' && operator !== null && !shouldResetInput) {
            // There's a pending operation, compute it first
            calculate();
        }

        // After calculate, currentInput holds the result; we now set operator
        operator = op;
        previousInput = currentInput;
        shouldResetInput = true; // Next digit will start new input
    }

    // ----- Clear All -----
    function clearAll() {
        currentInput = '';
        previousInput = '';
        operator = null;
        shouldResetInput = false;
        updateDisplay('0');
    }

    // ----- Backspace -----
    function backspace() {
        if (shouldResetInput) return; // Don't delete after operator
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || '0');
    }

    // ----- Event Listeners for Buttons -----
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.id;
            const text = target.textContent;

            // Numbers (0-9)
            if (target.classList.contains('number') && id !== 'decimal') {
                inputNumber(text);
            }
            // Decimal
            else if (id === 'decimal') {
                inputDecimal();
            }
            // Operators
            else if (target.classList.contains('operator')) {
                let op = text;
                if (op === '÷') op = '/';
                else if (op === '×') op = '*';
                else if (op === '−') op = '-';
                handleOperator(op);
            }
            // Equals
            else if (id === 'equals') {
                calculate();
            }
            // Clear
            else if (id === 'clear') {
                clearAll();
            }
            // Backspace
            else if (id === 'backspace') {
                backspace();
            }
        });
    });

    // ----- Keyboard Support -----
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        // Prevent default actions for calculator keys (e.g., page scrolling)
        if (/^[0-9\.\+\-\*\/=]$|Enter|Escape|Backspace/.test(key)) {
            e.preventDefault();
        }

        // Numbers 0-9
        if (key >= '0' && key <= '9') {
            inputNumber(key);
        }
        // Decimal
        else if (key === '.') {
            inputDecimal();
        }
        // Operators
        else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperator(key);
        }
        // Equals / Enter
        else if (key === '=' || key === 'Enter') {
            calculate();
        }
        // Clear (Escape)
        else if (key === 'Escape') {
            clearAll();
        }
        // Backspace
        else if (key === 'Backspace') {
            backspace();
        }
    });
});