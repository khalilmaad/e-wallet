/*
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

*/



import { getbeneficiaries, finduserbyaccount, findbeneficiarieByid } from "../models/database.js";
const user = JSON.parse(sessionStorage.getItem("user"));
// DOM elements
const greetingName = document.getElementById("greetingName");
const currentDate = document.getElementById("currentDate");
const solde = document.getElementById("availableBalance");
const incomeElement = document.getElementById("monthlyIncome");
const expensesElement = document.getElementById("monthlyExpenses");
const activecards = document.getElementById("activeCards");
const transactionsList = document.getElementById("recentTransactionsList");
const transferBtn = document.getElementById("quickTransfer");
const transferSection = document.getElementById("transferPopup");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCard = document.getElementById("sourceCard");
const submitTransferBtn = document.getElementById("submitTransferBtn");



const rechargeBtn = document.getElementById("quickTopup");
const rechargeSection = document.getElementById("rechargePopup");
const closeRechargeBtn = document.getElementById("closeRechargeBtn");
const cancelRechargeBtn = document.getElementById("cancelRechargeBtn");
const rechargeSourceCard = document.getElementById("rechargeSourceCard");
const submitRechargeBtn = document.getElementById("submitRechargeBtn");


// Guard
if (!user) {
  alert("User not authenticated");
  window.location.href = "../views/login.html";
}

// Events
transferBtn.addEventListener("click", handleTransfersection);
closeTransferBtn.addEventListener("click", closeTransfer);
cancelTransferBtn.addEventListener("click", closeTransfer);
submitTransferBtn.addEventListener("click", handleTransfer)

rechargeBtn.addEventListener("click", handleRechargeSection);
closeRechargeBtn.addEventListener("click", closeRecharge);
cancelRechargeBtn.addEventListener("click", closeRecharge);
submitRechargeBtn.addEventListener("click", handleRecharge);


// Retrieve dashboard data
const getDashboardData = () => {
  const monthlyIncome = user.wallet.transactions
    .filter(t => t.type === "credit")
    .reduce((total, t) => total + t.amount, 0);

  const monthlyExpenses = user.wallet.transactions
    .filter(t => t.type === "debit")
    .reduce((total, t) => total + t.amount, 0);

  return {
    userName: user.name,
    currentDate: new Date().toLocaleDateString("fr-FR"),
    availableBalance: `${user.wallet.balance} ${user.wallet.currency}`,
    activeCards: user.wallet.cards.length,
    monthlyIncome: `${monthlyIncome} MAD`,
    monthlyExpenses: `${monthlyExpenses} MAD`,
  };
};

function renderDashboard() {
  const dashboardData = getDashboardData();
  //console.log("Dashboard data:", dashboardData); // Debug log

  if (dashboardData) {
    greetingName.textContent = dashboardData.userName;
    currentDate.textContent = dashboardData.currentDate;
    solde.textContent = dashboardData.availableBalance;
    incomeElement.textContent = dashboardData.monthlyIncome;
    expensesElement.textContent = dashboardData.monthlyExpenses;
    activecards.textContent = dashboardData.activeCards;
  }
  // Display transactions
  transactionsList.innerHTML = "";
  user.wallet.transactions.forEach(transaction => {
    const transactionItem = document.createElement("div");
    transactionItem.className = "transaction-item";
    transactionItem.innerHTML = `
    <div>${transaction.date}</div>
    <div>${transaction.amount} MAD</div>
    <div>${transaction.type}</div>
  `;
    transactionsList.appendChild(transactionItem);
  });

}
renderDashboard();


function handleRechargeSection() {
  rechargeSection.classList.add("active");
  document.body.classList.add("popup-open");
}

function closeRecharge() {
  rechargeSection.classList.remove("active");
  document.body.classList.remove("popup-open");
}



// Transfer popup
function closeTransfer() {
  transferSection.classList.remove("active");
  document.body.classList.remove("popup-open");
}

function handleTransfersection() {
  transferSection.classList.add("active");
  document.body.classList.add("popup-open");
}

// Beneficiaries
const beneficiaries = getbeneficiaries(user.id);

function renderBeneficiaries() {
  beneficiaries.forEach((beneficiary) => {
    const option = document.createElement("option");
    option.value = beneficiary.id;
    option.textContent = beneficiary.name;
    beneficiarySelect.appendChild(option);
  });
}
renderBeneficiaries();
function renderCards() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type + "****" + card.numcards;
    sourceCard.appendChild(option);
  });
}


function rechargerenderCards() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");

    //if(Date.parse(card.expiry) > Date.now()) 
    option.value = card.numcards;

    option.textContent = card.type + "****" + card.numcards;
    rechargeSourceCard.appendChild(option);
  });
}

renderCards();
rechargerenderCards();

//###################################  Transfer  #####################################################//

// check function 

/* function checkUser(numcompte, callback) {
  setTimeout(() => {
    const destinataire = finduserbyaccount(numcompte);
    if (destinataire) {
      callback(destinataire);
    } else {
      console.log("Destinataire non trouvé");
    }
  }, 500);
}

function checkSolde(exp, amount, callback) {
  setTimeout(() => {
    const solde = exp.wallet.balance;
    if (solde >= amount) {
      callback("Solde suffisant");
    } else {
      callback("Solde insuffisant");
    }
  }, 400);
}

function updateSolde(exp, destinataire, amount, callback) {
  setTimeout(() => {  
    exp.wallet.balance -= amount;
    destinataire.wallet.balance += amount;
    callback("Solde mis à jour");
  }, 300);
}


function addtransactions(exp, destinataire, amount, callback) {
  setTimeout(() => { 
    // Transaction pour l'expéditeur (débit)
    const transactionDebit = {
      id: Date.now(),
      type: "debit",
      amount: amount,
      from: exp.name,
      to: destinataire.name,
      date: new Date().toLocaleDateString()
    };

    // Transaction pour le destinataire (crédit)
    const transactionCredit = {
      id: Date.now() + 1,
      type: "credit",
      amount: amount,
      from: exp.name,
      to: destinataire.name,
      date: new Date().toLocaleDateString()
    };

    user.wallet.transactions.push(transactionDebit);
    destinataire.wallet.transactions.push(transactionCredit);
    renderDashboard();
    callback("Transaction enregistrée");
  }, 200);
}


export function transferer(exp, numcompte, amount) {
  console.log("\n DÉBUT DU TRANSFERT ");

  // Étape 1: Vérifier le destinataire
  checkUser(numcompte, function afterCheckUser(destinataire) {
    console.log("Étape 1: Destinataire trouvé -", destinataire.name);

    // Étape 2: Vérifier le solde
    checkSolde(exp, amount, function afterCheckSolde(soldemessage) {
      console.log(" Étape 2:", soldemessage);

      if (soldemessage.includes("Solde suffisant")) {
        // Étape 3: Mettre à jour les soldes
        updateSolde(exp, destinataire, amount, function afterUpdateSolde(updatemessage) {
          console.log(" Étape 3:", updatemessage);

          // Étape 4: Enregistrer la transaction
          addtransactions(exp, destinataire, amount, function afterAddTransactions(transactionMessage) {
            console.log(" Étape 4:", transactionMessage);
            console.log(`Transfert de ${amount} réussi!`);
          });
        });
      }
    });
  });
}


function handleTransfer(e) {
 e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount=findbeneficiarieByid(user.id,beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

  
  transferer(user, beneficiaryAccount, amount);

} */

function checkUser(numcompte) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const beneficiary = finduserbyaccount(numcompte);
      if (beneficiary) {
        resolve(beneficiary);
      } else {
        reject(new Error("Beneficiary not found"));
      }
    }, 2000);
  });
}

function checkSolde(expediteur, amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (expediteur.wallet.balance >= amount) {
        resolve("Sufficient balance");
      } else {
        reject(new Error("Insufficient balance"));
      }
    }, 3000);
  });
}

function checkSoldeRecharge(card, amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (card.balance > amount) {
        resolve("Sufficient balance");
      } else {
        reject(new Error("Insufficient balance"));
      }
    }, 3000);
  });
}



function updateSolde(expediteur, destinataire, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      expediteur.wallet.balance -= amount;
      destinataire.wallet.balance += amount;
      resolve("Update balance done");
    }, 200);
  });
}


function updateSoldeRecharge(destinataire, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      destinataire.wallet.balance += amount;
      resolve("Update balance done");
    }, 200);
  });
}

function checkDate(card) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Date.parse(card.expiry) > Date.now()) {
        resolve("Card is valid");
      } else {
        reject(new Error("Invalid card"));
      }
    }, 3000);
  });
}

function addtransactions(expediteur, destinataire, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const credit = {
        id: Date.now(),
        type: "credit",
        amount: amount,
        date: new Date().toLocaleDateString("sv-SE"),
        from: expediteur.name,
      };
      const debit = {
        id: Date.now(),
        type: "debit",
        amount: amount,
        date: new Date().toLocaleDateString("sv-SE"),
        to: destinataire.name,
      };
      expediteur.wallet.transactions.push(debit);
      destinataire.wallet.transactions.push(credit);
      resolve("Transaction added successfully");
    }, 3000);
  });
}


function addtransactionsRecharge(destinataire, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const recharge = {
        id: Date.now(),
        type: "recharge",
        amount: amount,
        date: new Date().toLocaleDateString("sv-SE"),
        from: destinataire.name,
      };

      destinataire.wallet.transactions.push(recharge);
      resolve("Transaction added successfully");
    }, 3000);
  });
}

// **************************************transfer***************************************************//




async function transfer(expediteur, numcompte, amount) {
  try {
    const destinataire = await checkUser(numcompte);
    console.log("Étape 1: Destinataire trouvé -", destinataire.name);
    
    const soldeMessage = await checkSolde(expediteur, amount);
    console.log(soldeMessage);
    
    const updateMessage = await updateSolde(expediteur, destinataire, amount);
    console.log(updateMessage);
    
    const transactionMessage = await addtransactions(expediteur, destinataire, amount);
    console.log(transactionMessage);
    
    renderDashboard();
  } catch (error) {
    console.error("Erreur lors du transfert :", error.message);
  }
}

function handleTransfer(e) {
  e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount = findbeneficiarieByid(user.id, beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

  transfer(user, beneficiaryAccount, amount);

}

// **************************************recharge***************************************************//


async function recharge(destinataire, card, amount) {
  try {
    const dateMessage = await checkDate(card);
    console.log(dateMessage);
    
    const soldeMessage = await checkSoldeRecharge(card, amount);
    console.log(soldeMessage);
    
    const updateMessage = await updateSoldeRecharge(destinataire, amount);
    console.log(updateMessage);
    
    const transactionMessage = await addtransactionsRecharge(destinataire, amount);
    console.log(transactionMessage);
    
    alert("Recharge successful");
    renderDashboard();
  } catch (error) {
    console.error("Erreur lors du rechargement :", error.message);
    alert(error.message);
  }
}

function handleRecharge(e) {
  e.preventDefault();
  const sourceCard = document.getElementById("rechargeSourceCard").value;
  const amount = Number(document.getElementById("rechargeAmount").value);

  if (!sourceCard) {
    alert("Veuillez sélectionner une carte source.");
    return;
  }

  const card = user.wallet.cards.find(c => c.numcards === sourceCard);

  //console.log("Selected card number:", sourceCard); // Debug log
  //console.log("Selected card:", card); // Debug log

  recharge(user, card, amount);

}



/*
    function func1(number,callback){
        console.log("start function");
       if(number%2===0){
        console.log("start callback");
        callback(number);
        console.log("end callback");
       }else{
        
       }
       console.log("end function");
    }

    function produit(number){
        console.log("the result is : ", (number*number));
    }

    func1(4,produit);
    */