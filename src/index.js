import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';


const root = document.getElementById('root');

class App extends Component {
  constructor(props) {
    super();
    this.specialNumber = props.specialNumber;
    this.state = { products: [] };
    this.onDeleteProduct = this.onDeleteProduct.bind(this);
  }
  async componentDidMount() {
    const response = await axios.get('/api/products');
    const products = await response.data;

    this.setState(() => ({ products }));
  }
  onDeleteProduct(product) {
    const products = this.state.products.filter(_product => _product.id !== product.id);
    this.setState(() => ({ products }));
  }
  render() {
    // check if the current pathname matches the router pathname
    const active = pathname => this.props.router.location.pathname === pathname;
    // create an object {} and assign this.state to it so it can be passed down to the children
    // can also add additional function to the obj being passed down
    const obj = Object.assign({}, this.state, { onDeleteProduct: this.onDeleteProduct });
    return (
      <div className="container">
        <ul className="nav nav-tabs">
          <li className={active('/') ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={active('/products') ? 'active' : ''}>
            <Link to="/products">Products ({ this.state.products.length })</Link>
          </li>
        </ul>
        {/* this will render the component children.  Parent App, this will render
          Home or Products child componenet depending on url path */}
        {/* cloneElement clones the children and also pass the obj variable which
          has the state to the props.children */}
        { this.props.children && React.cloneElement(this.props.children, obj)}
      </div>
    );
  }
}

const Home = () => (
  <div className="well">
    Home
  </div>
);

const Products = ({ products, onDeleteProduct }) => (
  <div className="well">
    Products
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <button
            className="btn btn-warning"
            onClick={() => onDeleteProduct(product)}
          >
            Delete
          </button>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </li>
      ),
      )}
    </ul>
  </div>
);

const ProductDetail = (props) => {
  const filtered = props.products.filter(
    product => product.id.toString() === props.router.params.id);

  if (!filtered.length) {
    return null;
  }

  const product = filtered[0];
  return (
    <div className="well">
      <Link to="/products">Back</Link>
      <br />
      { product.name }
      <br />
      { product.id }
    </div>
  );
};

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="products" component={Products} />
      <Route path="products/:id" component={ProductDetail} />
    </Route>
  </Router>
);

render(routes, root);
