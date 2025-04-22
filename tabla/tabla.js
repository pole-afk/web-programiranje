let trenutniIgrac = 0;

const igraci = [
    { simbol: "🔴", pozicija: 0, novac: 1500, polja: [] },
    { simbol: "🔵", pozicija: 0, novac: 1500, polja: [] }
];

const dugme = document.createElement("button");
dugme.textContent = "Baci kockicu";
document.body.appendChild(dugme);

const info = document.createElement("div");
info.style.marginTop = "10px";
document.body.appendChild(info);

const sviDivovi = document.querySelectorAll(".polje, .polje-gore, .polje-dole, .polje_siroko");
const polja = Array.from(sviDivovi).map((el, index) => {
    // Dodavanje ikonice
    let ikonica = "🏙️";
    if (index === 0) ikonica = "🏁";
    else if ([5, 15, 25, 35].includes(index)) ikonica = "🚂";
    else if ([12, 28].includes(index)) ikonica = "⚡";
    else if ([4, 38].includes(index)) ikonica = "💸";
    else if (index === 30) ikonica = "🚓";

    if (!el.querySelector('.ikonica')) {
        el.innerHTML = `<div class="ikonica">${ikonica}</div>`;
    }

    return {
        id: index,
        ime: `Polje ${index}`,
        cena: 100 + (index * 10),
        vlasnik: null,
        element: el
    };
});

// Prikaz igrača na početku
prikaziIgraceNaTabli();

dugme.addEventListener("click", baciKocku);

function baciKocku() {
    const igrac = igraci[trenutniIgrac];
    const kocka = Math.floor(Math.random() * 6) + 1;

    // Uklanjanje igrača sa starih pozicija
    sviDivovi.forEach(div => {
        const figure = div.querySelectorAll('.igrac');
        figure.forEach(f => f.remove());
    });

    // Pomeraj
    igrac.pozicija = (igrac.pozicija + kocka) % polja.length;

    azurirajInfo(`🎲 Igrač ${trenutniIgrac + 1} (${igrac.simbol}) bacio je ${kocka}.`);

    prikaziIgraceNaTabli();
    proveriPoljeZaKupovinu(igrac);

    // Sledeći igrač
    trenutniIgrac = (trenutniIgrac + 1) % igraci.length;
}

function proveriPoljeZaKupovinu(igrac) {
    const polje = polja[igrac.pozicija];

    // Ako je polje slobodno
    if (polje.vlasnik === null && igrac.novac >= polje.cena) {
        dugmeKupi.style.display = "inline-block";
        dugmeKupi.onclick = () => {
            igrac.novac -= polje.cena;
            polje.vlasnik = trenutniIgrac;
            igrac.polja.push(polje.id);
            oznaciPoljeKaoKupljeno(polje.element, igrac.simbol);
            azurirajInfo(`✅ Igrač ${trenutniIgrac + 1} kupio je "${polje.ime}". Preostalo: ${igrac.novac}$`);
            dugmeKupi.style.display = "none";
        };
    } else if (polje.vlasnik !== null && polje.vlasnik !== trenutniIgrac) {
        // Ako je u vlasništvu drugog igrača
        dugmeKupi.style.display = "none";
        const vlasnik = igraci[polje.vlasnik];
        const renta = 50;
        igrac.novac -= renta;
        vlasnik.novac += renta;
        azurirajInfo(`💰 Polje u vlasništvu protivnika! Plaćeno ${renta}$. Preostalo: ${igrac.novac}$`);
    } else {
        dugmeKupi.style.display = "none";
    }
}


function oznaciPoljeKaoKupljeno(element, simbol) {
    element.style.borderColor = "gold";
    if (!element.querySelector(".vlasnik")) {
        const vlasnikSpan = document.createElement("div");
        vlasnikSpan.classList.add("vlasnik");
        vlasnikSpan.style.fontSize = "12px";
        vlasnikSpan.style.textAlign = "center";
        vlasnikSpan.textContent = `Vlasnik: ${simbol}`;
        element.appendChild(vlasnikSpan);
    }
}

function prikaziIgraceNaTabli() {
    igraci.forEach((igrac, index) => {
        const polje = polja[igrac.pozicija].element;

        // Obriši stare figure (ako ih ima)
        const stari = polje.querySelectorAll(".igrac");
        stari.forEach(f => f.remove());

        const span = document.createElement("span");
        span.textContent = igrac.simbol;
        span.classList.add("igrac");
        polje.appendChild(span);
    });
}

function azurirajInfo(text) {
    info.textContent = text;
}
const dugmeKupi = document.createElement("button");
dugmeKupi.textContent = "Kupi polje";
dugmeKupi.style.display = "none";
dugmeKupi.style.marginTop = "10px";
document.body.appendChild(dugmeKupi);
