// Osnovne postavke igre
const igraci = [
    { id: 1, ime: "Igrač 1", boja: "red", simbol: "🔴", novac: 1500, pozicija: 0, polja: [] },
    { id: 2, ime: "Igrač 2", boja: "blue", simbol: "🔵", novac: 1500, pozicija: 0, polja: [] },
    { id: 3, ime: "Igrač 3", boja: "green", simbol: "🟢", novac: 1500, pozicija: 0, polja: [] },
    { id: 4, ime: "Igrač 4", boja: "yellow", simbol: "🟡", novac: 1500, pozicija: 0, polja: [] }
];

let trenutniIgracIndex = 0;
let kockicaVrednost = 0;
let igraUToku = true;
let kupovinaDostupna = false;
// Cene polja i rente
const poljaInfo = {
    1: { cena: 60, renta: 2, boja: "smedja", kucice: 0, hotel: false },
    3: { cena: 60, renta: 4, boja: "smedja", kucice: 0, hotel: false },
    6: { cena: 100, renta: 6, boja: "svetloplava", kucice: 0, hotel: false },
    8: { cena: 100, renta: 6, boja: "svetloplava", kucice: 0, hotel: false },
    9: { cena: 120, renta: 8, boja: "svetloplava", kucice: 0, hotel: false },
    11: { cena: 140, renta: 10, boja: "roze" , kucice: 0, hotel: false },
    13: { cena: 140, renta: 10, boja: "roze", kucice: 0, hotel: false },
    14: { cena: 160, renta: 12, boja: "roze", kucice: 0, hotel: false },
    15: { cena: 200, renta: 0, boja: "zelena" , kucice: 0, hotel: false },
    16: { cena: 180, renta: 14, boja: "narandzasta", kucice: 0, hotel: false },
    18: { cena: 180, renta: 14, boja: "narandzasta", kucice: 0, hotel: false },
    19: { cena: 200, renta: 16, boja: "narandzasta", kucice: 0, hotel: false },
    21: { cena: 220, renta: 18, boja: "crvena" , kucice: 0, hotel: false },
    23: { cena: 220, renta: 18, boja: "crvena" , kucice: 0, hotel: false },
    24: { cena: 240, renta: 20, boja: "crvena", kucice: 0, hotel: false },
    25: { cena: 200, renta: 0, boja: "zelena" , kucice: 0, hotel: false },
    26: { cena: 260, renta: 22, boja: "zuta" , kucice: 0, hotel: false },
    27: { cena: 260, renta: 22, boja: "zuta" , kucice: 0, hotel: false },
    29: { cena: 280, renta: 24, boja: "zuta" , kucice: 0, hotel: false },
    31: { cena: 300, renta: 26, boja: "zelena", kucice: 0, hotel: false },
    32: { cena: 300, renta: 26, boja: "zelena", kucice: 0, hotel: false },
    34: { cena: 320, renta: 28, boja: "zelena" , kucice: 0, hotel: false },
    35: { cena: 200, renta: 0, boja: "zelena" , kucice: 0, hotel: false },
    37: { cena: 350, renta: 35, boja: "plava", kucice: 0, hotel: false },
    39: { cena: 400, renta: 50, boja: "plava", kucice: 0, hotel: false }
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
    document.getElementById('izgradi').addEventListener('click', izgradiKucuIliHotel);
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
        1: [0, 0, 0],    // [X, Y, Z] rotacije
        2: [90, 0, 0],   
        3: [0, 90, 0],   
        4: [0, -90, 0],  
        5: [-90, 0, 0],  
        6: [180, 0, 180]   
    };
    const [x, y, z] = rotacije[broj];

    let rotateX = x + 720; // Dodajemo 720 da dobijemo više rotacija za animaciju
    let rotateY = y + 720;
    let rotateZ = z + 720;

    kockica.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
}
// Vraća emoji u zavisnosti od broja na kockici
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
function izgradiKucuIliHotel() {
    const igrac = igraci[trenutniIgracIndex];
    const poz = igrac.pozicija;
    const polje = poljaInfo[poz];

    if (!polje || !igrac.polja.includes(poz)) {
        prikaziPoruku("Ne možete graditi na ovom polju!");
        return;
    }

    // Provera posedovanja svih iz boje
    const sveBoje = Object.entries(poljaInfo)
        .filter(([i, p]) => p.boja === polje.boja)
        .map(([i]) => parseInt(i));

    const posedujeSve = sveBoje.every(p => igrac.polja.includes(p));

    if (!posedujeSve) {
        prikaziPoruku("Morate posedovati sve iste boje da biste gradili!");
        return;
    }

    if (polje.hotel) {
        prikaziPoruku("Već postoji hotel!");
        return;
    }

    const cenaKuce = 50; // cena po kući (primer)
    if (igrac.novac < cenaKuce) {
        prikaziPoruku("Nemate dovoljno novca!");
        return;
    }

    igrac.novac -= cenaKuce;

    if (polje.kucice < 4) {
        polje.kucice++;
        prikaziPoruku(`${igrac.ime} je izgradio kuću! (${polje.kucice})`);
    } else {
        polje.hotel = true;
        polje.kucice = 0;
        prikaziPoruku(`${igrac.ime} je izgradio hotel!`);
    }

    osveziInformacijeIgraca();
    prikaziGradnjuNaPolju(poz);
}
function prikaziGradnjuNaPolju(pozicija) {
    const polje = document.querySelector(`.polje[data-index='${pozicija}']`);
    if (!polje) return;

    // uklanjanje starih prikaza
    polje.querySelectorAll('.kucica, .hotel').forEach(el => el.remove());

    const info = poljaInfo[pozicija];
    if (info.hotel) {
        const h = document.createElement('div');
        h.className = 'hotel';
        polje.appendChild(h);
    } else {
        for (let i = 0; i < info.kucice; i++) {
            const k = document.createElement('div');
            k.className = 'kucica';
            k.style.left = `${2 + i * 12}px`;
            polje.appendChild(k);
        }
    }
}
function prikaziPoruku(poruka) {
    document.getElementById('na-potezu').textContent = poruka;
}