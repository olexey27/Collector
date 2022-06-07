import React from 'react'
import Modell from '../model/Shopping'

class SortierDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sortierung: Modell.sortierung
        }
    }

    handleChange(event) {
        this.setState({sortierung: event.target.value})
    }

    render() {
        const sortKeys = Object.keys(Modell.SORTIERUNGEN)
        return (
            <div className="mdc-dialog mdc-dialog--open">
                <div className="mdc-dialog__container">
                    <div className="mdc-dialog__surface">
                        <h2 className="mdc-dialog__title">Wähle die Sortierung:</h2>

                        <div className="mdc-dialog__content">
                            <ul className="mdc-deprecated-list" onChange={e => this.handleChange(e)}>
                                <li><label htmlFor="eigene">
                                    <input type="radio" id="eigene" name="Sortierung" value={sortKeys[0]}
                                           defaultChecked={this.state.sortierung == sortKeys[0]}/>
                                    {sortKeys[0]}
                                </label>
                                </li>
                                <hr/>
                                <li><label htmlFor="auf">
                                    <input type="radio" id="auf" name="Sortierung" value={sortKeys[1]}
                                           defaultChecked={this.state.sortierung == sortKeys[1]}/>
                                    {sortKeys[1]}
                                </label>
                                </li>
                                <li><label htmlFor="ab">
                                    <input type="radio" id="ab" name="Sortierung" value={sortKeys[2]}
                                           defaultChecked={this.state.sortierung == sortKeys[2]}/>
                                    {sortKeys[2]}
                                </label>
                                </li>
                            </ul>
                        </div>

                        <div className="mdc-dialog__actions">
                            <button type="button" className="mdc-button mdc-button--raised"
                                    onClick={() => this.props.onDialogClose(this.state.sortierung, false)}>
                                <div className="mdc-button__ripple"></div>
                                <span className="mdc-button__label">Abbrechen</span>
                            </button>
                            &nbsp;
                            <button type="button" className="mdc-button mdc-button--raised"
                                    onClick={() => this.props.onDialogClose(this.state.sortierung, true)}>
                                <div className="mdc-button__ripple"></div>
                                <span className="mdc-button__label">OK</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SortierDialog
