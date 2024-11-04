const readline = require('readline');

const expenses = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function displayMain() {
    console.clear();
    console.log('Welcome to the MyFinance CLI App!\n');
    console.log(
        `This is a finance tracking application designed with developers in mind.\nIf you’re already familiar with using cli commands, this app will be very familiar to you!`
    );
    console.log(
        'Note: Data is stored temporarily and will be lost when the app is closed.'
    );
    console.log('Type "--help" at any time to view more information.\n');

    rl.question('Input: ', (input) => {
        if (input === '--help') {
            displayHelp();
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

    rl.question('Input: ', (input) => {
        if (input === '1') {
            displayMain();
        }
    });
}

function addExpense() {
    console.log(`--- Add Expense ---`);
    rl.question('Enter expense name: ', (input) => {});
}

displayMain();
