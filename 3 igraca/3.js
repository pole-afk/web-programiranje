3// Osnovne postavke igre
const igraci = [
    { id: 1, ime: "Igrač 1", boja: "red", simbol: "🔴", novac: 1500, pozicija: 0, polja: [] },
    { id: 2, ime: "Igrač 2", boja: "blue", simbol: "🔵", novac: 1500, pozicija: 0, polja: [] },
    { id: 3, ime: "Igrač 3", boja: "green", simbol: "🟢", novac: 1500, pozicija: 0, polja: [] },
];

let trenutniIgracIndex = 0;
let kockicaVrednost = 0;
let igraUToku = true;
let kupovinaDostupna = false;

// Cene polja i rente
const poljaInfo = {
    1: { cena: 60, renta: 2, boja: "smedja" },
    3: { cena: 60, renta: 4, boja: "smedja" },
    5: { cena: 200, renta: 0, boja: "zelena" },
    6: { cena: 100, renta: 6, boja: "svetloplava" },
    8: { cena: 100, renta: 6, boja: "svetloplava" },
    9: { cena: 120, renta: 8, boja: "svetloplava" },
    11: { cena: 140, renta: 10, boja: "roze" },
    13: { cena: 140, renta: 10, boja: "roze" },
    14: { cena: 160, renta: 12, boja: "roze" },
    15: { cena: 200, renta: 0, boja: "zelena" },
    16: { cena: 180, renta: 14, boja: "narandzasta" },
    18: { cena: 180, renta: 14, boja: "narandzasta" },
    19: { cena: 200, renta: 16, boja: "narandzasta" },
    21: { cena: 220, renta: 18, boja: "crvena" },
    23: { cena: 220, renta: 18, boja: "crvena" },
    24: { cena: 240, renta: 20, boja: "crvena" },
    25: { cena: 200, renta: 0, boja: "zelena" },
    26: { cena: 260, renta: 22, boja: "zuta" },
    27: { cena: 260, renta: 22, boja: "zuta" },
    29: { cena: 280, renta: 24, boja: "zuta" },
    31: { cena: 300, renta: 26, boja: "zelena" },
    32: { cena: 300, renta: 26, boja: "zelena" },
    34: { cena: 320, renta: 28, boja: "zelena" },
    35: { cena: 200, renta: 0, boja: "zelena" },
    37: { cena: 350, renta: 35, boja: "plava" },
    39: { cena: 400, renta: 50, boja: "plava" }
};

// Specijalna polja
const specijalnaPolja = {
    0: { tip: "start", opis: "Start - Dobijate 200$ kada prođete" },
    4: { tip: "porez", opis: "Porez - Plaćate 200$" },
    7: { tip: "šansa", opis: "Šansa - Izvučite kartu" },
    12: { tip: "elektrana", opis: "Elektrana - Plaćate 10x vrijednost bacanja kockice" },
    17: { tip: "šansa", opis: "Šansa - Izvučite kartu" },
    20: { tip: "parking", opis: "Besplatno parkiranje" },
    22: { tip: "šansa", opis: "Šansa - Izvučite kartu" },
    28: { tip: "vodovod", opis: "Vodovod - Plaćate 10x vrijednost bacanja kockice" },
    30: { tip: "idite_u_zatvor", opis: "Idite u zatvor" },
    33: { tip: "šansa", opis: "Šansa - Izvučite kartu" },
    36: { tip: "šansa", opis: "Šansa - Izvučite kartu" },
    38: { tip: "porez", opis: "Porez - Plaćate 100$" }
};

// Inicijalizacija igre
document.addEventListener('DOMContentLoaded', function() {
    osveziInformacijeIgraca();
    postaviDugmad();
    postaviFigurice();
});

// Postavljanje event listenera za dugmad
function postaviDugmad() {
    document.getElementById('baci-kockicu').addEventListener('click', baciKockicu);
    document.getElementById('kupi-polje').addEventListener('click', kupiPolje);
    document.getElementById('preskoci-kupovinu').addEventListener('click', preskociKupovinu);
}

// Postavljanje figurica na početne pozicije
function postaviFigurice() {
    const polja = document.querySelectorAll('.polje');
    
    // Uklanjanje svih figurica
    document.querySelectorAll('.figurica').forEach(fig => fig.remove());
    
    // Dodavanje novih figurica
    igraci.forEach(igrac => {
        const polje = polja[igrac.pozicija]; // Uzima poziciju igrača
        const figurica = document.createElement('div');
        figurica.className = `figurica igrac${igrac.id}`;
        figurica.textContent = igrac.simbol;
        polje.appendChild(figurica); // Dodaje figuricu u polje
    });
}


// Bacanje kockice
function baciKockicu() {
    if (!igraUToku) return;

    const dugme = document.getElementById('baci-kockicu');
    dugme.disabled = true;

    kockicaVrednost = Math.floor(Math.random() * 6) + 1;
    rotirajKockicu3D(kockicaVrednost);

    const trenutniIgrac = igraci[trenutniIgracIndex];
    const novaPozicija = (trenutniIgrac.pozicija + kockicaVrednost) % 40;

    let trenutnaPoz = trenutniIgrac.pozicija;

    setTimeout(() => {
        const interval = setInterval(() => {
            trenutnaPoz = (trenutnaPoz + 1) % 40;
            pomeriFiguricu(trenutniIgrac.id, trenutnaPoz);

            if (trenutnaPoz === novaPozicija) {
                clearInterval(interval);
                trenutniIgrac.pozicija = novaPozicija;
                obradiPolje(novaPozicija);
            }
        }, 200);
    }, 1000);
}
function rotirajKockicu3D(broj) {
    const kockica = document.getElementById('kockica-3d');
    const rotacije = {
        1: [0, 0],
        2: [90, 0],
        3: [0, -90],
        4: [0, 90],
        5: [-90, 0],
        6: [180, 0]
    };
    const [x, y] = rotacije[broj];
    kockica.style.transform = `rotateX(${x + 1800}deg) rotateY(${y + 1800}deg)`; 
}
function kockicaEmoji(broj) {
    const emojiji = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return emojiji[broj];
}

// Pomeranje figurice
function pomeriFiguricu(igracId, pozicija) {
    const polja = document.querySelectorAll('.polje');
    
    // Uklanjanje stare figurice
    const staraFigurica = document.querySelector(`.polje .figurica.igrac${igracId}`);
    if (staraFigurica) {
        staraFigurica.remove();
    }
    
    // Dodavanje nove figurice
    const polje = polja[pozicija];
    const figurica = document.createElement('div');
    figurica.className = `figurica igrac${igracId}`;
    const igrac = igraci.find(i => i.id === igracId);
    figurica.textContent = igrac.simbol;

    polje.appendChild(figurica);
}

// Obrada polja na koje je igrač došao
function obradiPolje(pozicija) {
    const trenutniIgrac = igraci[trenutniIgracIndex];
    let poruka = "";
    
    // Provera da li je polje u vlasništvu drugog igrača
    const vlasnikPolja = pronadjiVlasnikaPolja(pozicija);
    
    if (pozicija === 0) { // Start
        trenutniIgrac.novac += 200;
        poruka = `${trenutniIgrac.ime} je došao na START i dobio 200$!`;
    } 
    else if (specijalnaPolja[pozicija]) {
        const poljeInfo = specijalnaPolja[pozicija];
        
        switch (poljeInfo.tip) {
            case "porez":
                const iznos = pozicija === 4 ? 200 : 100;
                trenutniIgrac.novac -= iznos;
                poruka = `${trenutniIgrac.ime} plaća porez od ${iznos}$!`;
                break;
            case "idite_u_zatvor":
                trenutniIgrac.pozicija = 10; // Zatvor
                poruka = `${trenutniIgrac.ime} ide u zatvor!`;
                pomeriFiguricu(trenutniIgrac.id, 10);
                break;
            case "elektrana":
            case "vodovod":
                const iznosPlacanja = kockicaVrednost * 10;
                trenutniIgrac.novac -= iznosPlacanja;
                poruka = `${trenutniIgrac.ime} plaća ${iznosPlacanja}$ za ${poljeInfo.tip === "elektrana" ? "elektranu" : "vodovod"}!`;
                break;
            case "šansa":
                const nagrada = Math.floor(Math.random() * 100) + 50;
                trenutniIgrac.novac += nagrada;
                poruka = `${trenutniIgrac.ime} je izvukao šansu i dobio ${nagrada}$!`;
                break;
            default:
                poruka = poljeInfo.opis;
        }
    } 
    else if (vlasnikPolja && vlasnikPolja.id !== trenutniIgrac.id) {
        // Plaćanje rente
        const renta = poljaInfo[pozicija].renta;
        trenutniIgrac.novac -= renta;
        vlasnikPolja.novac += renta;
        poruka = `${trenutniIgrac.ime} plaća rentu od ${renta}$ igraču ${vlasnikPolja.ime}!`;
        
        // Provera bankrota
        if (trenutniIgrac.novac < 0) {
            poruka += ` ${trenutniIgrac.ime} je bankrotirao!`;
            igraUToku = false;
        }
    } 
    else if (poljaInfo[pozicija] && !vlasnikPolja) {
        // Polje je na prodaju
        kupovinaDostupna = true;
        prikaziDugmadZaKupovinu();
        poruka = `${trenutniIgrac.ime} je na polju ${pozicija} koje može da kupi za ${poljaInfo[pozicija].cena}$`;
    } 
    else {
        poruka = `${trenutniIgrac.ime} je na polju ${pozicija}`;
    }
    
    // Ažuriranje prikaza
    osveziInformacijeIgraca();
    document.getElementById('na-potezu').textContent = poruka;
    
    // Ako nema kupovine, prelazak na sledećeg igrača
    if (!kupovinaDostupna) {
        setTimeout(() => {
            promeniIgraca();
            document.getElementById('baci-kockicu').disabled = false;
        }, 1500);
    }
}

// Pronalaženje vlasnika polja
function pronadjiVlasnikaPolja(pozicija) {
    return igraci.find(igrac => igrac.polja.includes(pozicija));
}

// Prikazivanje dugmadi za kupovinu
function prikaziDugmadZaKupovinu() {
    document.getElementById('akcije').style.display = 'block';
}

// Skrivanje dugmadi za kupovinu
function sakrijDugmadZaKupovinu() {
    document.getElementById('akcije').style.display = 'none';
}

// Kupovina polja
function kupiPolje() {
    const trenutniIgrac = igraci[trenutniIgracIndex];
    const pozicija = trenutniIgrac.pozicija;
    const cenaPolja = poljaInfo[pozicija]?.cena;
    
    if (!cenaPolja) {
        document.getElementById('na-potezu').textContent = 
            "Ovo polje se ne može kupiti!";
        sakrijDugmadZaKupovinu();
        promeniIgraca();
        document.getElementById('baci-kockicu').disabled = false;
        return;
    }
    
    if (trenutniIgrac.novac >= cenaPolja) {
        trenutniIgrac.novac -= cenaPolja;
        trenutniIgrac.polja.push(pozicija);
        
        // Obojimo polje u boju igrača
        const poljeElement = document.querySelector(`.polje[data-index="${pozicija}"]`);
        if (poljeElement) {
            poljeElement.classList.add(`vlasnik${trenutniIgrac.id}`);

        }
        
        document.getElementById('na-potezu').textContent = 
            `${trenutniIgrac.ime} je kupio polje ${pozicija} za ${cenaPolja}$`;
    } else {
        document.getElementById('na-potezu').textContent = 
            `${trenutniIgrac.ime} nema dovoljno novca za kupovinu polja ${pozicija}!`;
    }
    
    kupovinaDostupna = false;
    sakrijDugmadZaKupovinu();
    osveziInformacijeIgraca();
    promeniIgraca();
    document.getElementById('baci-kockicu').disabled = false;
}

// Preskakanje kupovine polja
function preskociKupovinu() {
    const trenutniIgrac = igraci[trenutniIgracIndex];
    document.getElementById('na-potezu').textContent = 
        `${trenutniIgrac.ime} je odlučio da ne kupuje polje ${trenutniIgrac.pozicija}`;
    
    kupovinaDostupna = false;
    sakrijDugmadZaKupovinu();
    promeniIgraca();
    document.getElementById('baci-kockicu').disabled = false;
}

// Promena igrača
function promeniIgraca() {
    trenutniIgracIndex = (trenutniIgracIndex + 1) % igraci.length;
    document.getElementById('na-potezu').textContent = 
        `Na potezu: ${igraci[trenutniIgracIndex].ime} (${igraci[trenutniIgracIndex].simbol})`;
}

// Osvežavanje informacija o igračima
function osveziInformacijeIgraca() {
    igraci.forEach(igrac => {
        const igracInfo = document.getElementById(`igrac${igrac.id}-info`);
        if (igracInfo) {
            igracInfo.querySelector('.novac').textContent = igrac.novac;
            const poljaElement = igracInfo.querySelector('.polja');
            if (poljaElement) {
                poljaElement.textContent = igrac.polja.join(', ');
            }
        }
    });
}