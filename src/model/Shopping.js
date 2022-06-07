import Gruppe from './Gruppe.js'

/**
 * Diese Klasse steuert das Modell der App
 *
 * @property {Gruppe[]} gruppenListe      - enthält die Artikelgruppen
 * @property {Gruppe}   aktiveGruppe      - enthält die aktuell ausgewählte Gruppe
 * @property {boolean}  meldungenAusgeben - steuert, ob eine Meldung ausgegeben werden soll oder nicht
 */
class Shopping {
  gruppenListe = []
  aktiveGruppe = null
  meldungenAusgeben = true
  SORTIERUNGEN = {
    "Eigene Reihenfolge": this.sortiereIndex,
    "Aufsteigend": this.sortiereAufsteigend,
    "Absteigend": this.sortiereAbsteigend
  }
  sortierung = Object.keys(this.SORTIERUNGEN)[0]
  STORAGE_KEY = "einkaufslisteDaten"

  /**
   * Sucht eine Gruppe nach ihrem Namen und liefert sie als Objekt zurück
   * @param {String} suchName - Name der gesuchten Gruppe
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
   */
  gruppeFinden(suchName, meldungAusgeben) {
    for (let gruppe of this.gruppenListe) {
      if (gruppe.name == suchName) {
        return gruppe
      }
    }
    // nichts gefunden, meldung ausgeben
    if (meldungAusgeben) {
      this.informieren("[App] Gruppe \"" + suchName + "\" nicht gefunden", true)
    }
    return null
  }

  /**
   * Fügt eine Gruppe in der Gruppenliste hinzu
   * @param {String} name - Name der neuen Gruppe
   * @returns {Gruppe} neueGruppe - die neu hinzugefügte Gruppe
   */
  gruppeHinzufuegen(name) {
    let vorhandeneGruppe = this.gruppeFinden(name)
    if (!vorhandeneGruppe) {
      let neueGruppe = new Gruppe(name, this.gruppenListe.length)
      this.gruppenListe.push(neueGruppe)
      this.aktiveGruppe = neueGruppe
      this.informieren("[App] Gruppe \"" + name + "\" hinzugefügt")
      return neueGruppe
    } else {
      this.informieren("[App] Gruppe \"" + name + "\" existiert schon!", true)
    }
  }

  /**
   * Entfernt die Gruppe mit dem `name`
   * @param {String} name - Name der zu löschenden Gruppe
   */
  gruppeEntfernen(name) {
    let loeschGruppe = this.gruppeFinden(name)
    if (loeschGruppe) {
      let index = this.gruppenListe.indexOf(loeschGruppe)
      this.gruppenListe.splice(index, 1)
      this.informieren("[App] Gruppe \"" + name + "\" entfernt"
      )
    } else {
      this.informieren("[App] Gruppe \"" + name + "\" konnte NICHT entfernt werden!", true)
    }
  }

  /**
   * Benennt die Gruppe `alterName` um
   * @param {String} alterName - Name der umzubenennenden Gruppe
   * @param {String} neuerName - der neue Name der Gruppe
   */
  gruppeUmbenennen(alterName, neuerName) {
    let suchGruppe = this.gruppeFinden(alterName, true)
    if (suchGruppe) {
      suchGruppe.name = neuerName
      this.informieren("[App] Gruppe \"" + alterName + "\" umbenannt in \"" + neuerName + "\"")
    }
  }

  /**
   * Gibt die Gruppen mit Artikeln auf der Konsole aus
   */
  allesAuflisten() {
    console.debug("Einkaufsliste")
    console.debug("--------------------")
    for (const gruppe of this.gruppenListe) {
      console.debug("[" + gruppe.name + "]")
      gruppe.artikelAuflisten(false)
    }
  }

  /**
   * Gibt eine Meldung aus und speichert den aktuellen Zustand im LocalStorage
   * @param {String} nachricht - die auszugebende Nachricht
   * @param {boolean} istWarnung - steuert, ob die {@link nachricht} als Warnung ausgegeben wird
   */
  informieren(nachricht, istWarnung = false) {
    if (this.meldungenAusgeben) {
      if (istWarnung) {
        console.log(nachricht)
      } else {
        console.debug(nachricht)
        this.speichern()
      }
    }
  }

  /**
   * Sortiert Gruppen und Artikel nach der übergebenen `reihenfolge`
   * @param {String} reihenfolge - entspricht einem der Keys aus {@link SORTIERUNGEN}
   */
  sortieren(reihenfolge) {
    this.sortierung = reihenfolge
    const sortierFunktion = this.SORTIERUNGEN[reihenfolge]
    // sortiere zuerst die Gruppen
    this.gruppenListe.sort(sortierFunktion)

    // sortiere danach die Artikel jeder Gruppe
    for (let gruppe of this.gruppenListe) {
      gruppe.artikelListe.sort(sortierFunktion)
    }
    this.informieren("[App] nach \"" + reihenfolge + "\" sortiert")
  }

  /**
   * Sortiert Elemente alphabetisch aufsteigend nach dem Namen
   * @param {Gruppe|Artikel} a - erstes Element
   * @param {Gruppe|Artikel} b - zweites Element
   * @returns {Number} - wenn kleiner: -1, wenn gleich: 0, wenn größer: +1
   */
  sortiereAufsteigend(a, b) {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)
  }

  /**
   * Sortiert Elemente alphabetisch absteigend nach dem Namen
   * @param {Gruppe|Artikel} a - erstes Element
   * @param {Gruppe|Artikel} b - zweites Element
   * @returns {Number} - wenn kleiner: -1, wenn gleich: 0, wenn größer: +1
   */
  sortiereAbsteigend(a, b) {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    return nameA < nameB ? 1 : (nameA > nameB ? -1 : 0)
  }

  /**
   * Sortiert Elemente aufsteigend nach dem ursprünglichen Index
   * @param {Gruppe|Artikel} a - erstes Element
   * @param {Gruppe|Artikel} b - zweites Element
   * @returns {Number} - wenn kleiner: -1, wenn gleich: 0, wenn größer: +1
   */
  sortiereIndex(a, b) {
    return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0)
  }

  /**
   * Speichert den Modell-Zustand im LocalStorage
   * @param {Object} daten - entspricht dem Auf-Zuklapp-Zustand der App
   */
  speichern(daten) {
    const json = {
      gruppenListe: this.gruppenListe,
      aktiveGruppeName: this.aktiveGruppe.name,
    }
    // Object.assign(json, daten)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(json))
  }

  /**
   * Lädt den Modell-Zustand aus dem LocalStorage
   * @return {Boolean} erfolg - meldet, ob die Daten erfolgreich aus dem LocalStorage geladen wurden
   */
  laden() {
    const daten = localStorage.getItem(this.STORAGE_KEY)
    if (!daten) return false
    this.initialisieren(JSON.parse(daten))
    return true
  }

  /**
   * Initialisiert das Modell aus dem LocalStorage
   * @param {Object} jsonDaten - die übergebenen JSON-Daten
   */
  initialisieren(jsonDaten, ) {
    this.gruppenListe = []
    for(let gruppe of jsonDaten.gruppenListe) {
      let neueGruppe = this.gruppeHinzufuegen(gruppe.name)
      for (let artikel of gruppe.artikelListe) {
        neueGruppe.artikelObjektHinzufuegen(artikel)
      }
    }
    this.aktiveGruppe = this.gruppeFinden(jsonDaten.aktiveGruppeName)
  }
}

const Modell = new Shopping()

export default Modell
