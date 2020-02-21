import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      companiesTemp: '',
      companiesUrls: [],
      incomesTemp: [],
      companies: '',
      status: 'loading',
    }
  }

  filteringHandler = (e) => {
    console.log(e.target.value)
  }


  //function for get data from API
  componentDidMount() {
    fetch(`https://recruitment.hal.skygate.io/companies`)
      .then(resp => resp.json())
      .then(companiesTemp => {
        this.setState({ companiesTemp })
        companiesTemp.map((c) => (
          this.setState({
            companiesUrls: this.state.companiesUrls.concat(`https://recruitment.hal.skygate.io/incomes/${c.id}`)
          })
        ))
        Promise.all(this.state.companiesUrls.map(url =>
          fetch(url)
            .then(res => res.json())
            .then(res =>

              this.setState({
                incomesTemp: this.state.incomesTemp.concat(res)
              })
            )
        ))
      })
      .catch(err => console.error(err));

  }

  render() {

    // console.log(this.state.incomesTemp)
    // console.log("hello")

    // console.log(this.state.companiesUrls)
    // console.log(this.state.incomesTemp)

    // this.state.status === "fetched" ? console.log(this.state.incomesTemp) : null

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
            {/* {this.state.companies.length ? this.state.companies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.city}</td>
                <td>{company.incomes.value}</td>
                <td>{company.incomes.value}</td>
                <td>{company.incomes.value}</td>
              </tr>)
            ) : <tr><td>Loading...</td></tr>} */}
          </tbody>
        </table>
      </div>
    );
  }
}
export default App;
