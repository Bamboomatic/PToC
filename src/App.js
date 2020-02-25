import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      companiesTemp: [],
      incomesTemp: [],
      companies: [],
      status: 'loading',
    }
  }

  filteringHandler = (e) => {
    console.log(e.target.value)
  }

  //function for get data from API
  async componentDidMount() {
    await fetch(`https://recruitment.hal.skygate.io/companies`)
      .then(resp => resp.json())
      .then(companiesTemp => {
        this.setState({ companiesTemp })
        return companiesTemp
      })
      .then(async companiesTemp => {
        await companiesTemp.map(url =>
          fetch(`https://recruitment.hal.skygate.io/incomes/${url.id}`)
            .then(res => res.json())
            .then(res => (
              this.setState({
                incomesTemp: this.state.incomesTemp.concat(res),
              })
            ))

        )
      })
      .catch(err => console.error(err))
  }

  componentDidUpdate() {
    const cT = this.state.companiesTemp;
    const iT = this.state.incomesTemp;
    const companies = this.state.companies;

    if (this.state.incomesTemp.length === 300) {
      let companies = iT.map(
        inT => ({
          ...cT.find(
            (incom) => (incom.id === inT.id) && incom
          ), ...inT
        })
      );

      const today = new Date();
      let lastMonth = today.getMonth() === 0 ? 12 : (today.getMonth() > 9 ? today.getMonth() : "0" + today.getMonth())
      let year = today.getFullYear();

      companies = companies.map(
        c => (
          {
            total: c.incomes.reduce(function (prev, cur) {
              return prev + parseFloat(cur.value);
            }, 0).toFixed(2),
            avarage: ((c.incomes.reduce(function (prev, cur) {
              return prev + parseFloat(cur.value);
            }, 0)) / c.incomes.length).toFixed(2),
            last: c.incomes.reduce(function (prev, curr) {
              if (curr.date.includes(year + "-" + lastMonth)) {
                return prev + parseFloat(curr.value)
              }
              else { return prev }
            }, 0).toFixed(2),
            ...c
          }
        )
      )


      console.log(lastMonth)



      this.setState({ companies, incomesTemp: [], status: "fetched" })
    }

    if (this.state.status === "fetched") {
      console.log(companies)
    }





  }

  // this.state.status === "fetched" ? console.log(this.state.incomesTemp) : null

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
            {this.state.companies.length ? this.state.companies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.city}</td>
                <td>{company.total}</td>
                <td>{company.avarage}</td>
                <td>{company.last}</td>
              </tr>)
            ) : <tr><td>Loading...</td></tr>}
          </tbody>
        </table>
      </div>
    );
  }
}
export default App;
