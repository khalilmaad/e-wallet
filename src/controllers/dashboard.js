
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  alert("Session expired, please log in again.");
  window.location = "../views/login.html";
}

const usernameElement = document.getElementById('greetingName');

usernameElement.textContent = user.name;

const wallet = user.wallet;

const balanceElement = document.getElementById('availableBalance');
balanceElement.textContent = wallet.cards.reduce((total,card) => total + parseFloat(card.balance), 0) + " " + wallet.currency;

const IncomesElement = document.getElementById('monthlyIncome');
IncomesElement.textContent = wallet.transactions.filter(t => t.type ==="credit")
.reduce((total,t) => total + parseFloat(t.amount), 0) +" " + wallet.currency;

const expensesElement = document.getElementById('monthlyExpenses');
expensesElement.textContent = wallet.transactions.filter(t => t.type ==="debit")
.reduce((total,t) => total + parseFloat(t.amount), 0) +" " + wallet.currency;

const activeCardsElement = document.getElementById('activeCards');
activeCardsElement.textContent = wallet.cards.filter(c => Date.parse(c.expiry) > Date.now()).length;

const quicktransferButton = document.getElementById('quickTransfer');
quicktransferButton.addEventListener('click', () => {
    document.location = "../views/transfer.html";
});



//  TRANSACTIONS RÉCENTES

 
const transactionsList = document.getElementById("recentTransactionsList");
 
// Vider le contenu statique du HTML
transactionsList.innerHTML = "";
 
const recentTransactions = wallet.transactions.filter(t => {
    return Date.parse(t.date) > Date.now() - 7 * 24 * 60 * 60 * 1000; // Derniers 7 jours
})
 
// Si pas de transactions
if (recentTransactions.length === 0) {
    transactionsList.innerHTML = "<p style='color:#999; text-align:center;'>Aucune transaction.</p>";
}
 
// Créer une ligne par transaction
recentTransactions.forEach(transaction => {
 
    // Choisir l'icône et le nom selon le type
    const isCredit = transaction.type === "credit";
    const icone    = isCredit ? "fa-arrow-down" : "fa-arrow-up";
    const signe    = isCredit ? "+" : "-";
    const nom      = isCredit ? transaction.from : transaction.to;
 
    // Créer l'élément HTML
    const item = document.createElement("div");
    item.className = "transaction-item";
 
    item.innerHTML = `
        <div class="transaction-icon ${transaction.type}">
            <i class="fas ${icone}"></i>
        </div>
        <div class="transaction-details">
            <span class="transaction-name">${nom}</span>
            <span class="transaction-date">${transaction.date}</span>
        </div>
        <span class="transaction-amount ${transaction.type}">
            ${signe}${transaction.amount} ${wallet.currency}
        </span>
    `;
 
    transactionsList.appendChild(item);
});