document.getElementById('dugme').addEventListener('click', function() {
    // Retrieve values from the input fields
    const meseci = parseInt(document.getElementById('meseci').value);
    const cena = parseFloat(document.getElementById('cena').value);
    const treninzi = parseInt(document.getElementById('treninzi').value);
    const vezbaci = parseInt(document.getElementById('doveti').value);  // Corrected to parseInt

    // Validate the input values
    if (isNaN(meseci) || isNaN(cena) || isNaN(treninzi) || isNaN(vezbaci)) {
        alert("Molimo unesite validne brojeve.");
        return;
    }

    // If "vezbaci" is 4 or more, display "besplatno!"
    if (vezbaci >= 4) {
        document.getElementById('suma').value = "besplatno!";
        return;
    }

    // Calculate the discount based on the number of months
    let ukupniPopust = 0.005 * meseci;
    if (ukupniPopust > 0.03) {
        ukupniPopust = 0.03;
    }

    // Additional discount logic based on number of brought trainees and workouts
    if (vezbaci === 2) {
        ukupniPopust += 0.5;
    }

    if (treninzi >= 15 && treninzi <= 19) {
        ukupniPopust += 0.05;  // 5% popusta ako je broj treninga između 15 i 19
    } else if (treninzi > 20) {
        ukupniPopust += 0.1;  // 10% popusta ako je broj treninga veći od 20
    }

    // Calculate the final price after the discount
    const konacnaCena = meseci * cena * (1 - ukupniPopust);
    
    // Display the final price in the input field
    document.getElementById('suma').value = konacnaCena.toFixed(2);
});
