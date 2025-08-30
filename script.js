let participants = [];
let expenses = [];

function addParticipant() {
  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value.trim();

  if (!name || participants.includes(name)) {
    alert("Enter a unique name.");
    return;
  }

  participants.push(name);
  nameInput.value = "";
  updateParticipants();
  updateBalances();
}

function updateParticipants() {
  const list = document.getElementById("participantsList");
  list.innerHTML = "";
  participants.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
}

function addExpense() {
  const payer = document.getElementById("payerInput").value.trim();
  const amount = parseFloat(document.getElementById("amountInput").value);
  const category = document.getElementById("categoryInput").value;

  if (!payer || isNaN(amount) || amount <= 0 || !category) {
    alert("Fill all fields correctly.");
    return;
  }

  if (!participants.includes(payer)) {
    alert("Payer must be a participant.");
    return;
  }

  expenses.push({ payer, amount, category });
  document.getElementById("payerInput").value = "";
  document.getElementById("amountInput").value = "";
  document.getElementById("categoryInput").value = "";
  updateBalances();
  updateReminders();
  updateCategoryBreakdown();
}

function updateBalances() {
  const balances = {};
  participants.forEach(name => balances[name] = 0);

  expenses.forEach(({ payer, amount }) => {
    const share = amount / participants.length;
    participants.forEach(name => {
      balances[name] -= share;
    });
    balances[payer] += amount;
  });

  const list = document.getElementById("balancesList");
  list.innerHTML = "";
  participants.forEach(name => {
    const li = document.createElement("li");
    const balance = balances[name].toFixed(2);
    li.textContent = `${name}: ₹${balance}`;
    li.style.color = balance >= 0 ? "green" : "red";
    list.appendChild(li);
  });

  return balances;
}

function updateReminders() {
  const balances = updateBalances();
  const list = document.getElementById("remindersList");
  list.innerHTML = "";

  const debtors = participants.filter(name => balances[name] < 0);
  const creditors = participants.filter(name => balances[name] > 0);

  debtors.forEach(debtor => {
    creditors.forEach(creditor => {
      const amount = Math.min(
        Math.abs(balances[debtor]),
        balances[creditor]
      );
      if (amount > 0) {
        const li = document.createElement("li");
        li.textContent = `${debtor} should pay ₹${amount.toFixed(2)} to ${creditor}`;
        list.appendChild(li);
        balances[debtor] += amount;
        balances[creditor] -= amount;
      }
    });
  });
}

function updateCategoryBreakdown() {
  const categoryTotals = {};
  expenses.forEach(({ amount, category }) => {
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  for (const [category, total] of Object.entries(categoryTotals)) {
    const li = document.createElement("li");
    li.textContent = `${category}: ₹${total.toFixed(2)}`;
    list.appendChild(li);
  }
}