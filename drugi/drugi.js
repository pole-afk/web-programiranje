const igrac1 = [];
const igrac2 = [];
const sveKarte = new Set();

function vrednostKarte(karta) {
  const vrednosti = {
    '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 11, 'Q': 12,
    'K': 13, 'A': 14
  };
  return vrednosti[karta.slice(0, -1)];
}

function dodajKartu(igrac) {
  const broj = document.getElementById("broj").value;
  const znak = document.getElementById("znak").value;
  const karta = broj + znak;

  if (broj === "" || znak === "") return;

  if (sveKarte.has(karta)) {
    alert("Karta je već iskorišćena!");
    return;
  }

  if (igrac === 1) {
    if (igrac1.length >= 4) {
      alert("Igrač 1 već ima 4 karte!");
      return;
    }
    igrac1.push(karta);
  } else {
    if (igrac2.length >= 4) {
      alert("Igrač 2 već ima 4 karte!");
      return;
    }
    igrac2.push(karta);
  }

  sveKarte.add(karta);
}

function prikaziKarte() {
    if (igrac1.length < 4 || igrac2.length < 4) {
      alert("Oba igrača moraju imati po 4 karte da bi se prikazao pobednik!");
      return;
    }
  
    const rank1 = getPokerRank(igrac1);
    const rank2 = getPokerRank(igrac2);
  
    let tekst = `Igrač 1: ${igrac1.join(", ")}\nIgrač 2: ${igrac2.join(", ")}\n\n`;
  
    if (rank1[0] > rank2[0]) {
      tekst += "Pobednik: Igrač 1";
    } else if (rank1[0] < rank2[0]) {
      tekst += "Pobednik: Igrač 2";
    } else {
      if ((rank1[1] || 0) > (rank2[1] || 0)) {
        tekst += "Pobednik: Igrač 1 (jača karta)";
      } else if ((rank1[1] || 0) < (rank2[1] || 0)) {
        tekst += "Pobednik: Igrač 2 (jača karta)";
      } else {
        tekst += "Nerešeno – oba igrača imaju istu kombinaciju.";
      }
    }
  
    document.getElementById("rezultat").innerText = tekst;
  }

function resetIgra() {
  igrac1.length = 0;
  igrac2.length = 0;
  sveKarte.clear();
  document.getElementById("rezultat").innerText = "";
}

function getPokerRank(ruka) {
  const vrednosti = ruka.map(vrednostKarte).sort((a, b) => a - b);
  const znakovi = ruka.map(k => k.slice(-1));
  const brojac = {};

  for (let v of vrednosti) {
    brojac[v] = (brojac[v] || 0) + 1;
  }

  const counts = Object.values(brojac).sort((a, b) => b - a);
  const jeFlush = znakovi.every(z => z === znakovi[0]);
  const jeStraight = vrednosti.every((v, i, arr) => {
    if (i === 0) return true;
    return arr[i] - arr[i - 1] === 1;
  });

  if (jeFlush && jeStraight && vrednosti.includes(14) && vrednosti.includes(13)) {
    return [10, Math.max(...vrednosti)]; // Royal Flush
  }
  if (jeFlush && jeStraight) return [9, Math.max(...vrednosti)]; // Straight Flush
  if (counts[0] === 4) return [8];
  if (counts[0] === 3 && counts[1] === 2) return [7];
  if (jeFlush) return [6, Math.max(...vrednosti)];
  if (jeStraight) return [5, Math.max(...vrednosti)];
  if (counts[0] === 3) return [4];
  if (counts[0] === 2 && counts[1] === 2) return [3];
  if (counts[0] === 2) return [2];
  return [1, Math.max(...vrednosti)];
}