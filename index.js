const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt(questionText, callback) {
    rl.question(questionText, async (input) => {
        if (input === '--help') {
            displayHelp();
        } else if (input.includes(':add')) {
            const [_, formattedAddStr] = input.split(' ');
            const [category, name, cost] = formattedAddStr.split(',');
            const expense = { category, name, cost };
            try {
                await axios.post('http://localhost:3001/expenses', expense);
                console.log('\nExpense successfully added!');
            } catch (error) {
                console.error('Error adding expense', error);
            }
            displayMain();
        } else if (input.includes(':main')) {
            displayMain();
        } else if (input.includes(':home')) {
            displayHome();
        } else if (input.includes(':quit')) {
            prompt(
                `\nAre you sure you want to quit? You will lose unsaved progress. (y/n)\nInput: `,
                (input) => {
                    if (input === 'y' || input === 'yes') {
                        process.exit(0);
                    } else {
                        displayMain();
                    }
                }
            );
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
    console.log(':home to view home page.');
    console.log(':main to view main page.');
    console.log(':add category,name,cost to quickly add an expense.');
    console.log(':quit to exit the application.\n');

    prompt('Input: ', (input) => {
        if (input === '1') {
            displayMain();
        }
    });
}

async function displayViewExpenses() {
    console.log(`\n--- View Expenses---`);
    try {
        const { data: expenses } = await axios.get(
            'http://localhost:3001/expenses'
        );
        if (expenses.length === 0) {
            console.log('You have no expenses.');
        } else {
            console.log('Your Expenses: ');
            console.table(
                expenses.map((expense) => ({
                    Id: expense.id,
                    Name: expense.name,
                    Cost: `$${expense.cost}`,
                    Category: expense.category,
                }))
            );
        }
        displayMain();
    } catch (error) {
        console.error('Error getting expenses', error);
    }
}

function displayAddExpense() {
    console.log(`\n--- Add Expense ---`);
    console.log('There are 3 steps to add an expense.');
    const expense = {};
    function step1() {
        prompt('Step 1 Enter expense category: ', (input) => {
            expense.category = input;
            prompt('Step 2 Enter expense name: ', (input) => {
                expense.name = input;
                prompt('Step 3 Enter expense cost: ', async (input) => {
                    expense.cost = input;
                    try {
                        await axios.post(
                            'http://localhost:3001/expenses',
                            expense
                        );
                        console.log('\nExpense successfully added!');
                        displayMain();
                    } catch (error) {
                        console.error('Error adding expense', error);
                        displayMain();
                    }
                });
            });
        });
    }
    step1();
}

function displayDeleteExpense() {
    console.log(`\n--- Delete Expense ---`);
    prompt('Enter the Id of the expense you want to delete: ', (input) => {
        let idToDelete = input;
        prompt(
            `Please confirm you want to delete expense Id: ${idToDelete}. (y/n): `,
            async (input) => {
                if (input === 'y' || input === 'yes') {
                    try {
                        await axios.delete(
                            `http://localhost:3001/expenses/${idToDelete}`
                        );
                        console.log('\nExpense deleted successfully!');
                    } catch (error) {
                        console.error('Error deleting expense', error);
                    }
                    displayMain();
                } else {
                    console.log('You did not confirm to delete the expense.');
                    displayMain();
                }
            }
        );
    });
}

displayHome();
