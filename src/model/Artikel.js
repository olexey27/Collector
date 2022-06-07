/**
 * Klasse zum Beschreiben eines Artikels
 *
 * @property {Number}  counter - dient zur Erzeugung eindeutiger Artikel-IDs
 * @property {Number}  id      - eindeutige ID-Nummer des Artikels
 * @property {Number}  index   - Position des Artikels innerhalb der Artikelliste
 * @property {String}  name    - Name des Artikels
 * @property {Boolean} gekauft - merkt sich, ob der Artikel bereits gekauft wurde
 */
class Artikel {
  static counter = 1
  id = Artikel.counter++
  index
  name
  gekauft = false

  constructor(name, index) {
    this.name = name
    this.index = index
  }
}

export default Artikel
