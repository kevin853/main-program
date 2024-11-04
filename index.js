const readline = require('readline');

/**
 * {
 * name
 * cost
 * }
 */
const expenses = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt(questionText, callback) {
    rl.question(questionText, (input) => {
        if (input === '--help') {
            displayHelp();
        } else if (input.includes(':add')) {
            const [_, formattedAddStr] = input.split(' ');
            const [name, cost] = formattedAddStr.split(',');
            expenses.push({ name, cost });
            console.log('\nSuccessfully added the expense!');
            displayMain();
        } else {
            callback(input);
        }
    });
}

function displayHome() {
    console.clear();
    console.log('\nWelcome to the MyFinance CLI App!\n');
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
        if (input === '1') {
            displayViewExpenses();
        } else if (input === '2') {
            displayAddExpense();
        } else if (input === '3') {
            displayDeleteExpense();
        } else {
            console.log('You entered an invalid input.');
            displayMain();
        }
    });
}

function displayHelp() {
    console.clear();
    console.log('\n--- Help ---\n');
    console.log('Input 1 to return to main menu\n');
    console.log(
        'These are shortcut commands that can be typed at any time to help you.\n'
    );
    console.log(':add name,amount to quickly add an expense.');
    console.log(':quit to exit the application.\n');

    prompt('Input: ', (input) => {
        if (input === '1') {
            displayMain();
        }
    });
}

function displayViewExpenses() {
    console.log(`\n--- View Expenses---`);
    if (expenses.length === 0) {
        console.log('You have no expenses.');
    } else {
        console.log('Your Expenses: ');
        for (let i = 0; i < expenses.length; i++) {
            const expense = expenses[i];
            console.log(
                `Id: ${i}, Name: ${expense.name}, Cost: $${expense.cost}`
            );
        }
    }
    displayMain();
}

function displayAddExpense() {
    console.log(`\n--- Add Expense ---`);
    const expense = {};
    prompt('Enter expense name: ', (input) => {
        expense.name = input;
        prompt('Enter expense cost: ', (input) => {
            expense.cost = input;
            expenses.push(expense);
            console.log('\nExpense successfully added!');
            displayMain();
        });
    });
}

function displayDeleteExpense() {
    console.log(`\n--- Delete Expense ---`);
    if (expenses.length === 0) {
        console.log('You have no expenses to delete.');
    } else {
        prompt('Enter the Id of the expense you want to delete: ', (input) => {
            let indexToDelete = input;
            prompt(
                `Please confirm you want to delete ${expenses[input].name} expense. (y/n): `,
                (input) => {
                    if (input === 'y' || input === 'yes') {
                        expenses.splice(indexToDelete, 1);
                        console.log('\nExpense deleted successfully!');
                        displayMain();
                    } else {
                        console.log(
                            'You did not confirm to delete the expense.'
                        );
                        displayMain();
                    }
                }
            );
        });
    }
}

displayHome();
