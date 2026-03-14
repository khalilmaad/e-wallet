import {listusers} from "../models/database.js";

// Récupérer l'utilisateur connecté
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  alert("Session expired, please log in again.");
  window.location = "../views/login.html";
}

const wallet = user.wallet;


const beneficiaries = listusers().filter(name => name !== user.name);

const beneficiarySelect = document.getElementById("beneficiary");
const sourceCardSelect  = document.getElementById("sourceCard");

// Ajouter les bénéficiaires dans le select
beneficiaries.forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  beneficiarySelect.appendChild(option);
});

// Ajouter les cartes de l'utilisateur dans le select
wallet.cards.forEach(card => {
  const option = document.createElement("option");
  option.value = card.numcards;
  option.textContent = card.type.toUpperCase() + " – **** " + card.numcards.slice(-4) + " (" + card.balance + " " + wallet.currency +  ")";
  sourceCardSelect.appendChild(option);
});



const submitBtn  = document.getElementById("submitbtn");
const resultEl   = document.getElementById("result");
const errorEl    = document.getElementById("error");

submitBtn.addEventListener("click", handleTransfer);

function handleTransfer() {

  // Récupérer les valeurs
  const beneficiary = beneficiarySelect.value;
  const cardNum     = sourceCardSelect.value;
  const amount      = parseFloat(document.getElementById("amount").value);

  // ── Vérifications ──

  // 1. Bénéficiaire sélectionné ?
  if (!beneficiary) {
    showError("Veuillez choisir un bénéficiaire.");
    return;
  }

  // 2. Carte sélectionnée ?
  if (!cardNum) {
    showError("Veuillez sélectionner une carte.");
    return;
  }

  // 3. Montant valide ?
  if (!amount || amount <= 0) {
    showError("Veuillez entrer un montant valide.");
    return;
  }

  // 4. Trouver la carte dans le wallet
  const card = wallet.cards.find(c => c.numcards === cardNum);

  // 5. Solde suffisant ?
  if (amount > parseFloat(card.balance)) {
    showError("Solde insuffisant sur cette carte.");
    return;
  }

  // ── Tout est OK : simuler l'envoi ──

  submitBtn.textContent = "Envoi en cours...";
  clearMessages();

  setTimeout(() => {

    // Débiter la carte
    card.balance = (parseFloat(card.balance) - amount).toFixed(2);

    // Créer une transaction
    const newTransaction = {
      id:     String(Date.now()),
      type:   "debit",
      amount: amount,
      date:   new Date().toISOString().slice(0, 10),
      from:   card.numcards,
      to:     beneficiary
    };

    // Ajouter au wallet
    wallet.transactions.unshift(newTransaction);

    // Sauvegarder en session
    sessionStorage.setItem("user", JSON.stringify(user));

    // Afficher le succès
    /*resultEl.textContent = "✓ " + amount + " MAD envoyés à " + beneficiary + " avec succès !";
    resultEl.className = "success";
    submitBtn.textContent = "Envoyer";*/

    alert("✓ " + amount + " MAD envoyés à " + beneficiary + " avec succès !");
    document.location = "../views/transfer.html";

  }, 1500);
}

// ── Fonctions utilitaires ────────────────────

function showError(msg) {
  errorEl.textContent = msg;
  resultEl.textContent = "";
}

function clearMessages() {
  errorEl.textContent  = "";
  resultEl.textContent = "";
}
