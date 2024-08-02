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

    if (principalAmount <= 0 || interestRate <= 0 || loanTerm <= 0 || isNaN(principalAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Por favor, ingrese valores válidos y positivos para todos los campos.");
        return;
    }

    let historial = [];
    let interesGanado = 0;
    let balanceTotal = 0;
    let amortizationTable = [];

    if (interestType === 'compuesto') {
        [historial, interesGanado, balanceTotal, amortizationTable] = calcularInteresCompuesto(principalAmount, interestRate, loanTerm, n);
    } else if (interestType === 'simple') {
        [historial, interesGanado, balanceTotal, amortizationTable] = calcularInteresSimple(principalAmount, interestRate, loanTerm);
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

    // Mostrar u ocultar la tabla de amortización
    const amortizationTableContainer = document.getElementById('amortizationTableContainer');
    if (amortizationTable.length > 0) {
        amortizationTableContainer.style.display = 'block';
        const amortizationTableBody = document.getElementById('amortizationTable').getElementsByTagName('tbody')[0];
        amortizationTableBody.innerHTML = '';
        amortizationTable.forEach(({ periodo, pago, interes, principal, balance }) => {
            const row = amortizationTableBody.insertRow();
            const cellPeriodo = row.insertCell(0);
            const cellPago = row.insertCell(1);
            const cellInteres = row.insertCell(2);
            const cellPrincipal = row.insertCell(3);
            const cellBalance = row.insertCell(4);
            cellPeriodo.textContent = periodo;
            cellPago.textContent = pago.toFixed(2);
            cellInteres.textContent = interes.toFixed(2);
            cellPrincipal.textContent = principal.toFixed(2);
            cellBalance.textContent = balance.toFixed(2);
        });
    } else {
        amortizationTableContainer.style.display = 'none';
    }
}

function calcularInteresCompuesto(principal, tasa, tiempo, n) {
    let balance = principal;
    const historial = [];
    const amortizationTable = [];
    let periodo = 1;
    const pagosTotales = n * tiempo;

    for (let i = 0; i < pagosTotales; i++) {
        const pago = principal * (tasa / n) / (1 - Math.pow(1 + tasa / n, -pagosTotales));
        const interes = balance * (tasa / n);
        const principalPago = pago - interes;
        balance -= principalPago;
        amortizationTable.push({
            periodo: i + 1,
            pago: pago,
            interes: interes,
            principal: principalPago,
            balance: balance
        });
        historial.push([periodo++, balance]);
    }

    const interesGanado = principal * Math.pow(1 + tasa / n, pagosTotales) - principal;
    return [historial, interesGanado, principal + interesGanado, amortizationTable];
}

function calcularInteresSimple(principal, tasa, tiempo) {
    const interesGanado = principal * tasa * tiempo;
    const balanceTotal = principal + interesGanado;
    const historial = [];
    const amortizationTable = [];
    for (let año = 1; año <= tiempo; año++) {
        const pago = (principal * tasa) / tiempo;
        const interes = principal * tasa;
        const principalPago = principal / tiempo;
        const balance = principal - (principalPago * año);
        amortizationTable.push({
            periodo: año,
            pago: pago,
            interes: interes,
            principal: principalPago,
            balance: balance
        });
        historial.push([año, balanceTotal - (principalPago * año)]);
    }
    return [historial, interesGanado, balanceTotal, amortizationTable];
}

function resetForm() {
    document.getElementById('savingsForm').reset();
    document.getElementById('result').textContent = '';
    document.getElementById('balanceTable').getElementsByTagName('tbody')[0].innerHTML = '';
    document.getElementById('amortizationTable').getElementsByTagName('tbody')[0].innerHTML = '';
    document.getElementById('amortizationTableContainer').style.display = 'none';
}

function calculateSavings() {
    let P = parseFloat(document.getElementById('initialAmount').value);
    let r = parseFloat(document.getElementById('interestRate').value) / 100;
    let n = parseInt(document.getElementById('frequency').value);
    let t = parseInt(document.getElementById('period').value);
    let additionalDeposits = parseFloat(document.getElementById('additionalDeposits').value);
    let interestType = document.getElementById('interestType').value;
    let compoundingOption = parseInt(document.getElementById('compoundingOption').value);

    if (P <= 0 || r < 0 || n <= 0 || t <= 0 || additionalDeposits < 0 || isNaN(P) || isNaN(r) || isNaN(n) || isNaN(t) || isNaN(additionalDeposits)) {
        alert("Por favor, ingrese valores válidos y positivos para todos los campos.");
        return;
    }

    let A;
    let amortizationContent = '';

    // Limpiar la tabla de amortización antes de rellenarla
    document.querySelector('#amortizationTable tbody').innerHTML = '';

    if (interestType === 'simple') {
        // Interés Simple
        A = P * (1 + r * t);
        for (let i = 1; i <= n * t; i++) {
            let interest = P * r * (1 / n);
            let balance = P + interest + additionalDeposits;
            amortizationContent += `<tr>
                                        <td>${i}</td>
                                        <td>${P.toFixed(2)}</td>
                                        <td>${interest.toFixed(2)}</td>
                                        <td>${additionalDeposits.toFixed(2)}</td>
                                        <td>${balance.toFixed(2)}</td>
                                    </tr>`;
            P = balance;
        }
    } else {
        // Interés Compuesto
        A = P * Math.pow(1 + r / compoundingOption, compoundingOption * t);
        for (let i = 1; i <= n * t; i++) {
            let interest = P * (r / compoundingOption);
            let balance = P + interest + additionalDeposits;
            amortizationContent += `<tr>
                                        <td>${i}</td>
                                        <td>${P.toFixed(2)}</td>
                                        <td>${interest.toFixed(2)}</td>
                                        <td>${additionalDeposits.toFixed(2)}</td>
                                        <td>${balance.toFixed(2)}</td>
                                    </tr>`;
            P = balance;
        }
    }

    document.getElementById('result').innerText = `Monto Final: ${A.toFixed(2)}`;
    document.querySelector('#amortizationTable tbody').innerHTML = amortizationContent;
}

// Agregar funcionalidad al botón de reinicio
document.getElementById('reset-button').addEventListener('click', function() {
    resetForm();
});
