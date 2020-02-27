# PToC - Paginated Table of Companies

It is simple table-based project that fetches data from API and render it to paginated table (some values like avarage income or last month income are calculated on the fly and not just taken from API).

Project use only React without any additional dependencies and allowes you to test with Jest (sooo... additional dependency it is).

You can sort ascending and descending every column by clicking on column header (1st click ascending, 2nd descending).

You can filter records by typing anything in input field. City, name, id but also income values if u know them ;) Custom filter function goes over every rendered field.

Ofcourse you can sort after filtering.

Pagination works only in general view and is turned-off after being filtered as there is too little records even after typing only three characters.

Data are fetched only once since its only 300 records (with 50 incomes each, but still) and kept in state.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

