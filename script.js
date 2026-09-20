// ==========================================================
// Brunner Schreinerei – Beispiel-Firmenseite
// Dieses Skript macht zwei Dinge:
//   1. Es trägt automatisch das aktuelle Jahr in die Fusszeile ein.
//   2. Es prüft das Kontaktformular, bevor "gesendet" wird.
// ==========================================================


// ---------- 1. Jahreszahl in der Fusszeile ----------
document.querySelector("#jahr").textContent = new Date().getFullYear();


// ---------- 2. Kontaktformular ----------
const formular = document.querySelector("#kontaktformular");
const statusMeldung = document.querySelector("#formular-status");

// Für jedes Feld gibt es eine Regel. Sie liefert eine Fehlermeldung
// oder einen leeren Text, wenn alles in Ordnung ist.
// Die Schlüssel (name, email, nachricht) entsprechen dem name="..." im HTML.
const regeln = {
  name: (wert) =>
    wert.trim().length < 2 ? "Bitte geben Sie Ihren Namen an." : "",

  email: (wert) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wert)
      ? ""
      : "Bitte geben Sie eine gültige E-Mail-Adresse an, z. B. name@beispiel.ch.",

  nachricht: (wert) =>
    wert.trim().length < 10
      ? "Bitte schreiben Sie uns ein paar Worte zu Ihrem Vorhaben."
      : "",
};

// Prüft ein einzelnes Feld und zeigt die Meldung unter dem Feld an.
// Gibt true zurück, wenn das Feld in Ordnung ist.
function pruefeFeld(feld) {
  const meldung = regeln[feld.name](feld.value);
  document.querySelector(`#${feld.id}-fehler`).textContent = meldung;
  feld.setAttribute("aria-invalid", meldung ? "true" : "false");
  return meldung === "";
}

// Beim Absenden alle Felder prüfen
formular.addEventListener("submit", (ereignis) => {
  ereignis.preventDefault(); // verhindert das Neuladen der Seite

  const felder = [...formular.querySelectorAll("input, textarea")];
  const ergebnisse = felder.map(pruefeFeld); // alle Felder prüfen, nicht nur bis zum ersten Fehler

  if (ergebnisse.includes(false)) {
    statusMeldung.textContent = "Bitte korrigieren Sie die markierten Felder.";
    felder[ergebnisse.indexOf(false)].focus(); // Cursor ins erste fehlerhafte Feld
    return;
  }

  // Hier würde man die Daten an einen Server schicken (z. B. mit fetch()).
  // Diese Beispielseite hat keinen Server, darum zeigen wir nur eine Meldung.
  const name = formular.querySelector("#name").value.trim();
  statusMeldung.textContent = `Danke, ${name}! (Demo: Es wurde nichts wirklich gesendet.)`;
  formular.reset();
});

// Sobald jemand ein fehlerhaftes Feld korrigiert, verschwindet die Meldung sofort
formular.addEventListener("input", (ereignis) => {
  if (ereignis.target.getAttribute("aria-invalid") === "true") {
    pruefeFeld(ereignis.target);
  }
});
