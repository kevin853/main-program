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

    console.log('Type "--help" at any time to view more information.\n');
    console.log('Input anything to view Main Menu.\n');

    prompt('Input: ', (_) => {
        displayMain();
    });
}

function displayMain() {
    console.log(`\n--- Main Menu ---\nEnter any of the following inputs:`);
    console.log(`1. View Expense`);
    console.log(`2. Add Expense`);
    console.log(`3. Delete Expense`);
    console.log(`4. Display total spendings`);
    console.log(`5. Display spending by category`);
    console.log(`6. Get a random quote to feel inspired`);
    console.log(`7. Add a quote to your pool of quotes`);
    console.log(`8. Get all currency rates`);
    console.log(`9. Convert a currency to another currency`);
    console.log(`10. Add a currency exchange rate`);

    prompt('Input: ', async (input) => {
        if (input === '1') {
            displayViewExpenses();
        } else if (input === '2') {
            displayAddExpense();
        } else if (input === '3') {
            displayDeleteExpense();
        } else if (input === '4') {
            try {
                const { data } = await axios.get(
                    'http://localhost:3002/expenses/total'
                );
                console.log(`\nTotal spendings: ${data.totalCost}`);
                displayMain();
            } catch (error) {
                console.error(error);
            }
        } else if (input === '5') {
            try {
                const { data: categoricalExpenses } = await axios.get(
                    'http://localhost:3002/expenses/category'
                );
                console.table(
                    categoricalExpenses.map((expense) => ({
                        Category: expense.category,
                        'Total Cost': expense.total_cost,
                    }))
                );
            } catch (error) {
                console.error(error);
            }
            displayMain();
        } else if (input === '6') {
            try {
                const { data } = await axios.get(
                    'http://localhost:3003/quotes/random'
                );
                console.log(`\n${data.text}`);
            } catch (error) {
                console.error(error);
            }
            displayMain();
        } else if (input === '7') {
            prompt('What is the quote you want to add? ', async (input) => {
                const reqBody = { text: input };
                try {
                    await axios.post('http://localhost:3003/quotes', reqBody);
                    console.log(`\nSuccessfully added quote!`);
                    displayMain();
                } catch (error) {
                    console.error(error);
                }
            });
        } else if (input === '8') {
            try {
                const { data: exchangeRates } = await axios.get(
                    'http://127.0.0.1:5000/list'
                );
                console.table(
                    exchangeRates.map((rate) => ({
                        'From Currency': rate.from_currency,
                        'To Currency': rate.to_currency,
                        Rate: rate.rate,
                    }))
                );
                displayMain();
            } catch (error) {
                console.error(error);
            }
        } else if (input === '9') {
            const reqParams = {};
            prompt(
                'What is the from currency you want to convert? ',
                (input) => {
                    reqParams.from_currency = input;
                    prompt(
                        `What is the amount of currency you want to convert? `,
                        (input) => {
                            reqParams.amount = input;
                            prompt(
                                `What currency you want to convert to? `,
                                async (input) => {
                                    reqParams.to_currency = input;
                                    try {
                                        const { data } = await axios.get(
                                            'http://127.0.0.1:5000/convert',
                                            { params: reqParams }
                                        );
                                        console.log(
                                            `\nThe conversion is ${
                                                data.to_currency
                                            } ${data.converted_amount.toFixed(
                                                2
                                            )}`
                                        );
                                        displayMain();
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }
                            );
                        }
                    );
                }
            );
        } else if (input === '10') {
            const reqBody = {};
            prompt('What is the from currency you want to add? ', (input) => {
                reqBody.from_currency = input;
                prompt(`What is the to currency you want to add? `, (input) => {
                    reqBody.to_currency = input;
                    prompt(`What is the exchange rate? `, async (input) => {
                        reqBody.rate = input;
                        try {
                            await axios.post(
                                'http://127.0.0.1:5000/add',
                                reqBody
                            );
                            console.log(
                                `\nSuccessfully added new currency exchange`
                            );
                            displayMain();
                        } catch (error) {
                            console.error(error);
                        }
                    });
                });
            });
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
