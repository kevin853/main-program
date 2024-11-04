const readline = require('readline');

const expenses = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt(questionText, callback) {
    rl.question(questionText, (input) => {
        if (input === '--help') {
            displayHelp();
        } else {
            callback(input);
        }
    });
}

function displayHome() {
    console.clear();
    console.log('Welcome to the MyFinance CLI App!\n');
    console.log(
        `This is a finance tracking application designed with developers in mind.\nIf you’re already familiar with using cli commands, this app will be very familiar to you!`
    );
    console.log(
        'Note: Data is stored temporarily and will be lost when the app is closed.'
    );
    console.log('Type "--help" at any time to view more information.\n');
    console.log('Input 1 to view Main Menu.\n');

    prompt('Input: ', (input) => {
        if (input === '1') {
            displayMain();
        }
    });
}

function displayMain() {
    console.log(`\n--- Main Menu ---\nEnter any of the following inputs:`);
    console.log(`1. View Expense`);
    console.log(`2. Add Expense`);
    console.log(`3. Delete Expense`);

    prompt('Input: ', (input) => {
        if (input === '2') {
            displayAddExpense();
        }
    });
}

function displayHelp() {
    console.clear();
    console.log('--- Help ---\n');
    console.log('Input 1 to return to main menu\n');
    console.log(
        'These are shortcut commands that can be typed at any time to help you.\n'
    );
    console.log(':add name,amount,type to quickly add an expense.');
    console.log(':quit to exit the application.\n');

    prompt('Input: ', (input) => {
        if (input === '1') {
            displayMain();
        }
    });
}

function displayAddExpense() {
    console.log(`\n--- Add Expense ---`);
    const expense = {};
    prompt('Enter expense name: ', (input) => {
        expense.name = input;
        prompt('Enter expense cost: ', (input) => {
            expense.cost = input;
            prompt('Enter expense type: ', (input) => {
                expense.type = input;
                expenses.push(expense);
                console.log('Expense successfully added!');
                displayMain();
            });
        });
    });
}

displayHome();
