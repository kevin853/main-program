const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const handleQuit = (rl, currentPage) => {
    rl.question(
        'Are you sure you want to quit?\nYou will lose all progress if not saved.\nEnter (y/n)\n',
        (input) => {
            if (input === 'y' || input === 'yes') {
                rl.close();
            } else if (input === 'n' || input === 'no') {
                currentPage(rl);
            } else {
                console.log('\nInvalid input.');
                handleQuit(rl, currentPage);
            }
        }
    );
};

const displayHomePage = (rl) => {
    console.clear();
    console.log('Welcome to MyFinance CLI!\n');
    console.log(
        'This is a finance tracking application designed with developers in mind. If you’re already familiar with using cli commands, this app will be very familiar to you!!\n'
    );
    console.log(
        'This application will require you to create an account to view your dashboard. Once logged in, you will be able to track your finances. All your expenses will be in one place, and you can view insightful statistics to help you make informed financial decisions.\n'
    );

    console.log(
        `Commands:\nAt anytime you can input :quit to exit the application.\n`
    );

    console.log(
        `Please select an option:\nInput 1 to go to Log In page.\nInput 2 to go to Sign Up page.`
    );

    rl.question('Your input: ', (input) => {
        if (input === ':quit') {
            handleQuit(rl, displayHomePage);
        }
    });
};

displayHomePage(rl);
