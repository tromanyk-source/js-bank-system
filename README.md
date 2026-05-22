# Практична робота №5 — Bank Account System

**Тема:** Об'єкти  

## Опис

У цій практичній роботі я реалізував систему банківських рахунків 
на JavaScript. Програма дозволяє створювати рахунки, поповнювати 
їх, знімати кошти, робити перекази між рахунками та переглядати 
історію транзакцій.

## Що використовував з теми

- Об'єкти та методи об'єктів
- Closure для приватних даних (баланс, транзакції)
- Getter для форматованого балансу
- Деструктуризація в параметрах функцій
- Object.values(), filter(), reduce()
- Валідація даних та обробка помилок через try/catch
- this keyword

## Структура програми

**createAccount** — створює об'єкт рахунку з такими методами:
- deposit(amount) — поповнення рахунку
- withdraw(amount) — зняття коштів
- transfer(amount, targetAccount) — переказ на інший рахунок
- getBalance() — отримати баланс
- getTransactions() — історія всіх транзакцій
- getTransactionsByType(type) — транзакції за типом
- freeze() — заморозити рахунок
- close() — закрити рахунок

**createAccountManager** — менеджер для керування рахунками:
- createAccount(data) — створити новий рахунок
- getAccount(accountNumber) — знайти рахунок за номером
- getTotalBalance(holderName) — загальний баланс власника
- freezeAccount(accountNumber) — заморозити рахунок
- closeAccount(accountNumber) — закрити рахунок
- getAllAccounts() — список всіх рахунків