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
      sortedAsc: false,
      lastSorted: '',
      currentPage: 1,
      numberOfPages: 10,
      numberOfRows: 300,
      prevPage: 1,
    }
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
      let yearOfLastMonth = (lastMonth === 12) ? today.getFullYear() - 1 : today.getFullYear();

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
              if (curr.date.includes(yearOfLastMonth + "-" + lastMonth)) {
                return prev + parseFloat(curr.value)
              }
              else { return prev }
            }, 0).toFixed(2),
            ...c
          }
        )
      )
      this.setState({ companies, incomesTemp: [], status: "fetched" })
    }
  }
  handlePages = (e) => {

    document.getElementById(this.state.prevPage).classList.remove("active");
    e.target.className += " active";

    this.setState({ currentPage: e.target.id, prevPage: e.target.id });
  }
  debounce(func, delay) {
    let inDebounce
    return function () {
      const context = this
      const args = arguments
      clearTimeout(inDebounce)
      inDebounce = setTimeout(() => func.apply(context, args), delay)
    }
  }

  filteringHandler = this.debounce(input => {
    this.setState({ inputValue: input.toLowerCase(), currentPage: 1 })
  }, 250)

  sortingHandler = (e) => {
    this.setState({ companies: this.state.companies.sort(this.customSorting(e)) })
  }

  customSorting = (e) => {
    if (this.state.sortedAsc && this.state.lastSorted === e) {
      if (e === "name" || e === "city") {
        this.setState({ sortedAsc: false, lastSorted: e })
        return (a, b) => (a[e] > b[e]) ? -1 : 1
      }
      else {
        this.setState({ sortedAsc: false, lastSorted: e })
        return (a, b) => { return b[e] - a[e] }
      }

    }
    else {
      if (e === "name" || e === "city") {
        this.setState({ sortedAsc: true, lastSorted: e })
        return (a, b) => (a[e] > b[e]) ? 1 : -1
      }
      else {
        this.setState({ sortedAsc: true, lastSorted: e })
        return (a, b) => { return a[e] - b[e] }
      }
    }
  }

  contentLoader = () => {
    this.state.prevPage === 1 && this.state.currentPage === 1 ? (document.getElementById("1").className += " active") : console.log();
    let input = this.state.inputValue;
    let start = (30 * (this.state.currentPage - 1));
    let end = (30 * (this.state.currentPage))

    if (input === '') {
      let content = this.state.companies.slice(start, end)
        .map((company) => (
          <tr key={company.id}>
            <td>{company.id}</td>
            <td>{company.name}</td>
            <td>{company.city}</td>
            <td>{company.total}</td>
            <td>{company.avarage}</td>
            <td>{company.last}</td>
          </tr>
        ))
      return content
    }

    else {

      let content = this.state.companies
        .filter(function (condition) {
          return (condition.id.toString().includes(input) ||
            condition.name.toLowerCase().includes(input) ||
            condition.city.toLowerCase().includes(input) ||
            condition.total.toString().includes(input) ||
            condition.avarage.toString().includes(input) ||
            condition.last.toString().includes(input))
        })
        .map((company) => (
          <tr key={company.id}>
            <td>{company.id}</td>
            <td>{company.name}</td>
            <td>{company.city}</td>
            <td>{company.total}</td>
            <td>{company.avarage}</td>
            <td>{company.last}</td>
          </tr>
        ))

      return content
    }
  }



  render() {

    const pageNumbers = [];
    for (let i = 1; i <= this.state.numberOfPages; i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          className="pageBtn"
          key={number}
          id={number}
          onClick={this.handlePages}
        >
          {number}
        </li>
      );
    });



    return (
      <div className="App">
        <input type="text" className="input" onKeyUp={e => this.filteringHandler(e.target.value)} placeholder="Search for anything" />

        <table id="companies">
          <thead className="header">
            <tr >
              <th id="id" onClick={e => this.sortingHandler(e.target.id)}>id</th>
              <th id="name" onClick={e => this.sortingHandler(e.target.id)}>name</th>
              <th id="city" onClick={e => this.sortingHandler(e.target.id)}>city</th>
              <th id="total" onClick={e => this.sortingHandler(e.target.id)}>total income</th>
              <th id="avarage" onClick={e => this.sortingHandler(e.target.id)}>avarage income</th>
              <th id="last" onClick={e => this.sortingHandler(e.target.id)}>last month income</th>
            </tr>
          </thead>
          <tbody>
            {this.state.companies.length ? this.contentLoader() : <tr><td>Loading...</td></tr>}
          </tbody>
        </table>
        <nav className="pagination">
          {!this.state.inputValue ? renderPageNumbers : null}
        </nav>

      </div>
    );
  }
}
export default App;
