const readline = require('readline');

const expenses = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function displayWelcomeMessage() {
    console.log('Welcome to the Finance Tracker CLI App!');
    console.log('Easily track your expenses to manage your finances better.\n');
    console.log(
        'Note: Data is stored temporarily and will be lost when the app is closed.'
    );
    console.log("Let's get started!\n");
}

function mainMenu() {
    console.log('\n=== Main Menu ===');
    console.log('1. Add an Expense');
    console.log('2. View Expenses');
    console.log('3. Edit an Expense');
    console.log('4. Delete an Expense');
    console.log('5. Help');
    console.log('6. Exit');
    rl.question(
        'Choose an option (enter the number or command name): ',
        (option) => {
            const input = option.trim().toLowerCase();
            switch (input) {
                case '1':
                case 'add':
                    addExpense();
                    break;
                case '2':
                case 'view':
                    viewExpenses();
                    break;
                case '3':
                case 'edit':
                    editExpense();
                    break;
                case '4':
                case 'delete':
                    deleteExpense();
                    break;
                case '5':
                case 'help':
                    displayHelp();
                    break;
                case '6':
                case 'exit':
                    rl.close();
                    break;
                default:
                    console.log('Invalid option. Please try again.');
                    mainMenu();
            }
        }
    );
}

function addExpense() {
    console.log('\n--- Add an Expense ---');
    console.log(
        'You can record a new expense here. This helps you keep track of where your money goes.'
    );

    rl.question('Enter expense name: ', (name) => {
        if (!name.trim()) {
            console.log(
                'Name cannot be empty. Please provide a name for your expense.'
            );
            return addExpense();
        }
        rl.question('Enter expense cost: ', (cost) => {
            const parsedCost = parseFloat(cost);
            if (isNaN(parsedCost)) {
                console.log('Invalid cost. Please enter a numerical value.');
                return addExpense();
            }
            rl.question('Enter expense type: ', (type) => {
                if (!type.trim()) {
                    console.log(
                        'Type cannot be empty. Please specify the type of expense.'
                    );
                    return addExpense();
                }
                const expense = {
                    name: name.trim(),
                    cost: parsedCost,
                    type: type.trim(),
                };
                console.log('\nReview your expense:');
                console.log(`Name: ${expense.name}`);
                console.log(`Cost: $${expense.cost.toFixed(2)}`);
                console.log(`Type: ${expense.type}`);

                rl.question(
                    'Do you want to save this expense? (yes/no): ',
                    (confirm) => {
                        if (confirm.trim().toLowerCase() === 'yes') {
                            expenses.push(expense);
                            console.log('Expense added successfully!');
                            mainMenu();
                        } else {
                            console.log('Expense not saved.');
                            mainMenu();
                        }
                    }
                );
            });
        });
    });
}

function viewExpenses() {
    console.log('\n--- View Expenses ---');
    if (expenses.length === 0) {
        console.log('No expenses recorded.');
    } else {
        console.log('Your Expenses:');
        expenses.forEach((expense, index) => {
            console.log(
                `${index + 1}. Name: ${
                    expense.name
                }, Cost: $${expense.cost.toFixed(2)}, Type: ${expense.type}`
            );
        });
    }
    mainMenu();
}

function editExpense() {
    console.log('\n--- Edit an Expense ---');
    if (expenses.length === 0) {
        console.log('No expenses to edit.');
        return mainMenu();
    }
    viewExpenses();
    rl.question(
        'Enter the number of the expense you want to edit: ',
        (number) => {
            const index = parseInt(number) - 1;
            if (isNaN(index) || index < 0 || index >= expenses.length) {
                console.log('Invalid selection. Please try again.');
                return editExpense();
            }
            const expense = expenses[index];
            console.log('Leave the field blank to keep the current value.');
            rl.question(
                `Enter new name (current: ${expense.name}): `,
                (name) => {
                    if (name.trim()) {
                        expense.name = name.trim();
                    }
                    rl.question(
                        `Enter new cost (current: $${expense.cost.toFixed(
                            2
                        )}): `,
                        (cost) => {
                            if (cost.trim()) {
                                const parsedCost = parseFloat(cost);
                                if (!isNaN(parsedCost)) {
                                    expense.cost = parsedCost;
                                } else {
                                    console.log(
                                        'Invalid cost input. Keeping previous cost.'
                                    );
                                }
                            }
                            rl.question(
                                `Enter new type (current: ${expense.type}): `,
                                (type) => {
                                    if (type.trim()) {
                                        expense.type = type.trim();
                                    }
                                    console.log(
                                        'Expense updated successfully!'
                                    );
                                    mainMenu();
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}

function deleteExpense() {
    console.log('\n--- Delete an Expense ---');
    if (expenses.length === 0) {
        console.log('No expenses to delete.');
        return mainMenu();
    }
    viewExpenses();
    rl.question(
        'Enter the number of the expense you want to delete: ',
        (number) => {
            const index = parseInt(number) - 1;
            if (isNaN(index) || index < 0 || index >= expenses.length) {
                console.log('Invalid selection. Please try again.');
                return deleteExpense();
            }
            rl.question(
                `Are you sure you want to delete "${expenses[index].name}"? (yes/no): `,
                (confirm) => {
                    if (confirm.trim().toLowerCase() === 'yes') {
                        expenses.splice(index, 1);
                        console.log('Expense deleted successfully!');
                    } else {
                        console.log('Expense not deleted.');
                    }
                    mainMenu();
                }
            );
        }
    );
}

function displayHelp() {
    console.log('\n--- Help ---');
    console.log('This app helps you track your expenses by allowing you to:');
    console.log('- Add new expenses with a name, cost, and type.');
    console.log('- View all recorded expenses.');
    console.log('- Edit existing expenses to correct any mistakes.');
    console.log('- Delete expenses you no longer want to track.');
    console.log(
        '\nYou can navigate through the app using the main menu options.'
    );
    console.log('At any prompt, you can type "exit" to quit the app.');
    mainMenu();
}

rl.on('close', () => {
    console.log('\nThank you for using the Finance Tracker CLI App!');
    process.exit(0);
});

displayWelcomeMessage();
mainMenu();
