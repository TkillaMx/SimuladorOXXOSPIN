function showForm(formId) {
    // Ocultar todos los formularios
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => form.style.display = 'none');
    
    // Mostrar el formulario seleccionado
    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

function calculateMortgage() {
    const principalAmount = parseFloat(document.getElementById('principalAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const interestType = document.getElementById('interestType').value;
    const n = parseInt(document.getElementById('compoundingOption').value);

    let historial = [];
    let interesGanado = 0;
    let balanceTotal = 0;

    if (interestType === 'compuesto') {
        [historial, interesGanado, balanceTotal] = calcularInteresCompuesto(principalAmount, interestRate, loanTerm, n);
    } else if (interestType === 'simple') {
        [historial, interesGanado, balanceTotal] = calcularInteresSimple(principalAmount, interestRate, loanTerm);
    }

    document.getElementById('result').textContent = 
        `Interés total ganado: $${interesGanado.toFixed(2)}\nMonto total al final del periodo: $${balanceTotal.toFixed(2)}`;
    
    const balanceTableBody = document.getElementById('balanceTable').getElementsByTagName('tbody')[0];
    balanceTableBody.innerHTML = '';
    historial.forEach(([periodo, balance]) => {
        const row = balanceTableBody.insertRow();
        const cellPeriodo = row.insertCell(0);
        const cellBalance = row.insertCell(1);
        cellPeriodo.textContent = periodo;
        cellBalance.textContent = balance.toFixed(2);
    });
}

function calcularInteresCompuesto(principal, tasa, tiempo, n) {
    let balance = principal;
    const historial = [];

    for (let periodo = 1; periodo <= n * tiempo; periodo++) {
        balance *= (1 + tasa / n);
        historial.push([periodo, balance]);
    }

    const interesGanado = balance - principal;
    return [historial, interesGanado, balance];
}

function calcularInteresSimple(principal, tasa, tiempo) {
    const interesGanado = principal * tasa * tiempo;
    const balanceTotal = principal + interesGanado;
    const historial = [];

    for (let año = 1; año <= tiempo; año++) {
        historial.push([año, principal + principal * tasa * año]);
    }

    return [historial, interesGanado, balanceTotal];
}
