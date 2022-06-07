import Artikel from "./Artikel.js"
import Modell from "./Shopping.js"

/**
 * Klasse zum Gruppieren der Artikel
 *
 * @property {Number}    counter      - dient zur Erzeugung eindeutiger Gruppen-IDs
 * @property {Number}    id           - eindeutige ID-Nummer der Gruppe
 * @property {Number}    index        - Position der Gruppe innerhalb der Gruppenliste
 * @property {String}    name         - Name der Gruppe
 * @property {Artikel[]} artikelListe - Liste der Artikel in dieser Gruppe
 */
class Gruppe {
  static counter = 1
  id = Gruppe.counter++
  index
  name
  artikelListe = []

  constructor(name, index) {
    this.name = name
    this.index = index
  }

  /**
   * Sucht einen Artikel anhand seines Namens
   * @param {String} suchName - Name des gesuchten Artikels
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Artikel|null}
   */
  artikelFinden(suchName, meldungAusgeben) {
    for (let artikel of this.artikelListe) {
      if (artikel.name == suchName) {
        return artikel
      }
    }
    if (meldungAusgeben) {
      Modell.informieren("[" + this.name + "] Artikel " + suchName + " nicht gefunden", true)
    }
    return null
  }

  /**
   * Listet die Artikel in dieser Gruppe in der Konsole auf
   * @param {Boolean} gekauft - steuert die Anzeige der gekauften oder noch zu kaufenden Artikel
   */
  artikelAuflisten(gekauft) {
    for (let artikel of this.artikelListe) {
      if (artikel.gekauft == gekauft) {
        console.debug("  " + artikel.name)
      }
    }
  }

  /**
   * Fügt einen Artikel zur ArtikelListe hinzu und gibt diesen als Wert zurück
   * @param {String} name - Name des neuen Artikels
   * @returns {Artikel} neuerArtikel - der neu erzeugte Artikel
   */
  artikelHinzufuegen(name) {
    let vorhandenerArtikel = this.artikelFinden(name, false)
    if (!vorhandenerArtikel) {
      let neuerArtikel = new Artikel(name, this.artikelListe.length)
      this.artikelListe.push(neuerArtikel)
      Modell.informieren("[" + this.name + "] Artikel " + name + " hinzugefügt")
      return neuerArtikel
    } else {
      Modell.informieren("[" + this.name + "] Artikel " + name + " existiert schon!", true)
    }
  }

  /**
   * Erzeugt einen neuen Artikel aus einem eingelesenen JSON-Objekt.
   * Wird von {@link Modell.initialisieren()} verwendet.
   * @param {object} artikel - das übergebene JSON-Objekt
   */
  artikelObjektHinzufuegen(artikel) {
    let neuerArtikel = this.artikelHinzufuegen(artikel.name)
    // kopiert alle Properties aus "artikel" nach "neuerArtikel"
    Object.assign(neuerArtikel, artikel)
  }

  /**
   * Entfernt einen Artikel aus der ArtikelListe
   * @param {String} name - Index des zu entfernenden Artikels
   */
  artikelEntfernen(name) {
    let loeschArtikel = this.artikelFinden(name)
    if (loeschArtikel) {
      const index = this.artikelListe.indexOf(loeschArtikel)
      this.artikelListe.splice(index, 1)
      this.artikelNeuNummerieren()
      Modell.informieren("[" + this.name + "] Artikel \"" + name + "\" entfernt"
      )
    } else {
      Modell.informieren("[" + this.name + "] Artikel \"" + name + "\" konnte NICHT entfernt werden", true
      )
    }
  }

  /**
   * Nummeriert alle Artikel in der Artikel-Liste neu durch
   */
  artikelNeuNummerieren() {
    for (let i = 0; i < this.artikelListe.length; i++) {
      this.artikelListe[i].index = i
    }
  }

  /**
   * Sucht einen Artikel anhand des Namens und benennt ihn um.
   * @param {String} alterName - Name des zu findenden Artikels
   * @param {String} neuerName - neuer Name des Artikels
   */
  artikelUmbenennen(alterName, neuerName) {
    let vorhandenerArtikel = this.artikelFinden(alterName)
    if (vorhandenerArtikel) {
      vorhandenerArtikel.name = neuerName
    }
    Modell.informieren("[" + this.name + "] Artikel \"" + alterName + "\" umbenannt in \"" + neuerName + "\"")
  }
}

export default Gruppe
