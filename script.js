// =========================================
// БАНКІВСЬКА СИСТЕМА — Практична робота №5
// =========================================

function createAccountManager() {
    // Приватне сховище через closure
    const accounts = {};

    // =========================================
    // Account Object
    // =========================================
    function createAccount({ holderName, type = "standard", initialBalance = 0 }) {
        // Валідація
        if (!holderName) {
            throw new Error("Ім'я власника обов'язкове");
        }
        if (initialBalance < 0) {
            throw new Error("Початковий баланс не може бути від'ємним");
        }

        // Приватні дані через closure
        let balance = initialBalance;
        const transactions = [];
        let isFrozen = false;
        let isClosed = false;

        // Приватний метод запису транзакції
        function recordTransaction(type, amount, description = "") {
            transactions.push({
                type,
                amount,
                description,
                date: new Date().toLocaleString("uk-UA"),
                balanceAfter: balance
            });
        }

        // Публічний об'єкт рахунку
        return {
            accountNumber: "ACC-" + Date.now(),
            holder: holderName,
            type,
            createdAt: new Date().toLocaleString("uk-UA"),

            // Getter для форматованого балансу
            get formattedBalance() {
                return `${balance.toFixed(2)} грн`;
            },

            // Отримати баланс
            getBalance() {
                return balance;
            },

            // Поповнення
            deposit(amount) {
                if (isClosed) throw new Error("Рахунок закрито");
                if (isFrozen) throw new Error("Рахунок заморожено");
                if (amount <= 0) throw new Error("Сума повинна бути більше 0");

                balance += amount;
                recordTransaction("deposit", amount, "Поповнення рахунку");
                console.log(`Поповнено на ${amount} грн. Баланс: ${this.formattedBalance}`);
                return this;
            },

            // Зняття
            withdraw(amount) {
                if (isClosed) throw new Error("Рахунок закрито");
                if (isFrozen) throw new Error("Рахунок заморожено");
                if (amount <= 0) throw new Error("Сума повинна бути більше 0");
                if (amount > balance) throw new Error("Недостатньо коштів");

                balance -= amount;
                recordTransaction("withdraw", amount, "Зняття коштів");
                console.log(`Знято ${amount} грн. Баланс: ${this.formattedBalance}`);
                return this;
            },

            // Переказ на інший рахунок
            transfer(amount, targetAccount) {
                if (isClosed) throw new Error("Рахунок закрито");
                if (isFrozen) throw new Error("Рахунок заморожено");
                if (amount <= 0) throw new Error("Сума повинна бути більше 0");
                if (amount > balance) throw new Error("Недостатньо коштів");

                balance -= amount;
                recordTransaction("transfer", amount, `Переказ на рахунок ${targetAccount.accountNumber}`);
                targetAccount.deposit(amount);
                console.log(`Переказано ${amount} грн. Ваш баланс: ${this.formattedBalance}`);
                return this;
            },

            // Історія транзакцій
            getTransactions() {
                return [...transactions]; // повертаємо копію
            },

            // Транзакції за типом
            getTransactionsByType(type) {
                return transactions.filter(t => t.type === type);
            },

            // Транзакції за діапазоном дат (рядки для простоти)
            getTransactionsByDateRange(start, end) {
                const startDate = new Date(start);
                const endDate = new Date(end);
                return transactions.filter(t => {
                    const tDate = new Date(t.date);
                    return tDate >= startDate && tDate <= endDate;
                });
            },

            // Заморозити
            freeze() {
                isFrozen = true;
                console.log(`Рахунок ${this.accountNumber} заморожено`);
            },

            // Закрити
            close() {
                isClosed = true;
                console.log(`Рахунок ${this.accountNumber} закрито`);
            },

            // Інфо про рахунок
            getInfo() {
                const { accountNumber, holder, type, createdAt } = this;
                return { accountNumber, holder, type, createdAt, balance: this.formattedBalance };
            }
        };
    }

    // =========================================
    // Account Manager
    // =========================================
    return {
        // Створити рахунок
        createAccount(data) {
            const account = createAccount(data);
            accounts[account.accountNumber] = account;
            console.log(`Рахунок ${account.accountNumber} створено для ${account.holder}`);
            return account;
        },

        // Отримати рахунок за номером
        getAccount(accountNumber) {
            const account = accounts[accountNumber];
            if (!account) throw new Error("Рахунок не знайдено");
            return account;
        },

        // Загальний баланс власника
        getTotalBalance(holderName) {
            const total = Object.values(accounts)
                .filter(acc => acc.holder === holderName)
                .reduce((sum, acc) => sum + acc.getBalance(), 0);
            console.log(`Загальний баланс ${holderName}: ${total.toFixed(2)} грн`);
            return total;
        },

        // Заморозити рахунок
        freezeAccount(accountNumber) {
            this.getAccount(accountNumber).freeze();
        },

        // Закрити рахунок
        closeAccount(accountNumber) {
            this.getAccount(accountNumber).close();
        },

        // Всі рахунки
        getAllAccounts() {
            return Object.values(accounts).map(acc => acc.getInfo());
        }
    };
}

// =========================================
// ТЕСТИ
// =========================================
console.log("=== ТЕСТИ ===\n");

const manager = createAccountManager();

// Створення рахунків
const acc1 = manager.createAccount({ holderName: "Іван Петренко", type: "standard", initialBalance: 1000 });
const acc2 = manager.createAccount({ holderName: "Марія Коваль", type: "savings", initialBalance: 500 });

console.log("\n--- Операції ---");
acc1.deposit(500);
acc1.withdraw(200);
acc1.transfer(300, acc2);

console.log("\n--- Баланси ---");
console.log("acc1:", acc1.formattedBalance);
console.log("acc2:", acc2.formattedBalance);

console.log("\n--- Транзакції acc1 ---");
console.log(acc1.getTransactions());

console.log("\n--- Транзакції за типом (deposit) ---");
console.log(acc2.getTransactionsByType("deposit"));

console.log("\n--- Загальний баланс ---");
manager.getTotalBalance("Іван Петренко");

console.log("\n--- Всі рахунки ---");
console.log(manager.getAllAccounts());

console.log("\n--- Тест заморозки ---");
manager.freezeAccount(acc1.accountNumber);
try {
    acc1.deposit(100);
} catch (e) {
    console.log("Помилка:", e.message);
}

console.log("\n--- Тест валідації ---");
try {
    manager.createAccount({ holderName: "" });
} catch (e) {
    console.log("Помилка:", e.message);
}

try {
    acc2.withdraw(99999);
} catch (e) {
    console.log("Помилка:", e.message);
}