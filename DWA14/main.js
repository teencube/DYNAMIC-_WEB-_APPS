import { LitElement, html, css } from 'lit';
import { connect } from 'lit-redux-connect';
import { createStore } from 'redux';




// Redux store
const store = createStore(tallyReducer);

class LitTallyApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      font-family: 'Arial', sans-serif;
      margin: 50px;
    }

    button {
      font-size: 1.5rem;
      margin: 0 10px;
    }

    .min-reached, .max-reached {
      color: blue;
      font-weight: bold;
    }
  `;

  @connect(store)
  stateChanged(state) {
    this.count = state.count;
    this.state = this.updateState(this.count);
  }

 

  increment() {
    store.dispatch({ type: INCREMENT });
  }

  decrement() {
    store.dispatch({ type: DECREMENT });
  }

  render() {
    return html`
      <h1>Lit Tally App</h1>
      <p>Count: ${this.count}</p>
      <p class="${this.state === 'Minimum Reached' ? 'min-reached' : (this.state === 'Maximum Reached' ? 'max-reached' : '')}">${this.state}</p>
      <button @click="${this.increment}">Increment</button>
      <button @click="${this.decrement}">Decrement</button>
    `;
  }
}

customElements.define('lit-tally-app', LitTallyApp);
