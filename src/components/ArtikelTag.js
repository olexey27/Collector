import React from 'react'

class ArtikelTag extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // schaltet den Edit-Mode um
      isEditing: false,
      // enthält den neuen Namen im Edit-Mode
      newName: this.props.artikel.name
    }
  }

  /**
   * Reagiert auf Änderungen im Eingabefeld und speichert den neuen Wert im newName-state
   * @param {Event.CHANGE} event - das Change-Event im Eingabefeld
   */
  handleChange(event) {
    this.setState({newName: event.target.value})
  }

  /**
   * Benennt einen Artikel um
   * @param {Artikel} artikel - der umzubenennende Artikel
   * @param {Event.KEYPRESS} event -
   */
  artikelUmbenennen(artikel, event) {
    if (event && event.key != "Enter") return
    // ToDo: Modell.aktuelleGruppe.artikelUmbenennen() verwenden
    artikel.name = this.state.newName
    this.setState({isEditing: false})
  }

  render() {
    const artikel = this.props.artikel
    let artikelName = artikel.name
    if (artikel.gekauft) {
      artikelName = <s>{artikel.name}</s>
    }

    // erlaubt das abhaken und reaktivieren
    const viewTemplate = (
      <dd>
        <label>
          <input type="checkbox" checked={artikel.gekauft}
                 onChange={() => this.props.checkHandler(artikel)}/>
          {artikelName}
        </label>
        {!artikel.gekauft ?
          <i className="material-icons"
             onClick={() => this.setState({isEditing: true})}>edit</i>
          : ""
        }
        <i className="material-icons"
           onClick={this.props.deleteHandler}>delete</i></dd>
    )

    // erlaubt das Ändern des Namens
    let editTemplate = (
      <dd>
        <input type="search" value={this.state.newName} autoFocus={true}
               onChange={event => this.handleChange(event)}
               onKeyPress={event => this.artikelUmbenennen(artikel, event)}/>
        <i className="material-icons"
           onClick={() => this.setState({isEditing: false})}>cancel </i>
        <i className="material-icons"
           onClick={() => this.artikelUmbenennen(artikel)}>check_circle </i>
      </dd>
    )


    return (
      this.state.isEditing
        ? editTemplate
        : viewTemplate
    )
  }
}

export default ArtikelTag
