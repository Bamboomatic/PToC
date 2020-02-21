import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
    }
  }

  filteringHandler = (e) => {
    console.log(e.target.value)
  }


  render() {

    return (
      <div className="App">
        <input type="text" className="input" onKeyUp={e => this.filteringHandler(e)} placeholder="Search for anything" />

        <table id="companies">
          <thead className="header">
            <tr>
              <td>id</td>
              <td>name</td>
              <td>city</td>
              <td>total income</td>
              <td>avarage income</td>
              <td>last month income</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
            </tr>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
            </tr>
          </tbody>

        </table>
      </div>
    );
  }
}
export default App;
