document.addEventListener('DOMContentLoaded', () => {
    const displayContent = document.querySelector('.display-content');
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.btns button');
    const resetButton = document.querySelector('.reset');
    const equalButton = document.querySelector('.equal');
    const deleteButton = document.querySelector('.delete');

    let equation = '';  // Stores the full equation
    let result = '';    // Stores the calculation result

    // Common function to handle input
    function handleInput(value) {
        if (isNumber(value) || value === '.') {
            handleNumber(value);
        } else if (isOperator(value)) {
            handleOperator(value);
        }
        updateDisplay();
        autoScrollToEnd();
    }

    // Attach event listeners for mouse clicks on calculator buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleInput(button.textContent);
        });
    });

    // Attach event listeners for keyboard input
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (isNumber(key) || key === '.') {
            handleInput(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleInput(convertKeyToOperator(key));
        } else if (key === 'Enter') {
            event.preventDefault(); // Prevent form submission if Enter is pressed
            calculateAndDisplay();
        } else if (key === 'Backspace') {
            handleBackspace();
        }
    });

    equalButton.addEventListener('click', calculateAndDisplay);
    deleteButton.addEventListener('click', handleBackspace);
    resetButton.addEventListener('click', () => {
        resetCalculator();
        updateDisplay('0');
        autoScrollToEnd();
    });

    function handleNumber(value) {
        const lastNumber = equation.split(/[\+\-\x\/]/).pop();  // Get the last number in the equation

        if (value === '.' && lastNumber.includes('.')) return;  // Prevent adding more than one decimal point in a number

        if (equation.length < 50) {  // Adjust the length as needed
            equation += value;
        }
    }

    function handleOperator(value) {
        if (equation && !isOperator(equation.slice(-1))) {  // Prevent consecutive operators
            equation += ` ${value} `;
        }
    }

    function handleBackspace() {
        equation = equation.trimEnd().slice(0, -1).trimEnd();  // Remove last character from the equation
        updateDisplay();
        autoScrollToEnd();
    }

    function calculateAndDisplay() {
        if (equation) {
            calculate();
            updateDisplay(result);
            equation = result.toString();  // Update equation with result for further operations
            autoScrollToEnd();
        }
    }

    function calculate() {
        try {
            // Replace 'x' with '*' for multiplication and evaluate the equation
            result = eval(equation.replace(/x/g, '*').replace(/÷/g, '/'));

            // Check if the result is a decimal and round off to 5 decimal places
            if (result % 1 !== 0) {
                result = parseFloat(result.toFixed(10));
            }

            equation = result.toString();
        } catch (e) {
            result = 'Error';
        }
    }

    function updateDisplay(content = equation) {
        displayContent.textContent = content || '0';
    }

    function autoScrollToEnd() {
        display.scrollLeft = display.scrollWidth;  // Scroll to the end of the content
    }

    function resetCalculator() {
        equation = '';
        result = '';
    }

    function isNumber(value) {
        return !isNaN(value);
    }

    function isOperator(value) {
        return ['+', '-', 'x', '/'].includes(value);
    }

    function convertKeyToOperator(key) {
        switch (key) {
            case '*': return 'x';
            case '/': return '/';
            default: return key;
        }
    }
});
