const productList = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

// --------------------------------------------------------------
class ProductCategoryRow extends React.Component {
  constructor(props) {
    super(props);
    // binding
    
  }
  
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="2">=={category}==</th>
      </tr>
    );
  }
}

class ProductRow extends React.Component {
  constructor(props) {
    super(props);
    // binding
    
  }
  
  render() {
    const product = this.props.product;
    const name = product.stocked ?
      product.name :
      <span style={{color: 'red'}}>
        {product.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    // binding
    
  }
  
  render() {
    const rows = [];
    let lastCategory = null;
    
    this.props.products.forEach((product) => {
      if (product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category}
          />
        );
      }
      rows.push(
        <ProductRow
          product={product}
          key={product.name}
        />
      );
      
      lastCategory = product.category;
    });
    
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}


// --------------------------------------------------------------
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    // binding
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleIsStockOnlyChange = this.handleIsStockOnlyChange.bind(this);
  }
  
  handleFilterTextChange(event) {
    this.props.onFilterTextChange(event.target.value);
  }
  
  handleIsStockOnlyChange(event) {
    this.props.onIsStockOnlyChange(event.target.checked);
  }
  
  render() {
    const checked = this.props.isStockOnly;
    return (
      <div>
        <input type="text" value={this.props.filterText}
          placeholder="Search..."
          onChange={this.handleFilterTextChange}
        />
        <p>
          <input type="checkbox"
            onChange={this.handleIsStockOnlyChange}
          />Only show products in stock
        </p>
      </div>
    );
  }
}

// --------------------------------------------------------------
class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    // binding
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleIsStockOnlyChange = this.handleIsStockOnlyChange.bind(this);
    
    this.state = {
      filterText: '',
      inStockOnly: false,
    };
  }
  
  handleFilterTextChange(filterText) {
    // console.log('handleFilterTextChange', filterText);
    this.setState({
      filterText: filterText,
    });
  }
  
  handleIsStockOnlyChange(isStockOnly) {
    // console.log('handleIsStockOnly', isStockOnly, typeof isStockOnly);
    this.setState({
      isStockOnly: isStockOnly,
    });
  }
  
  doFilter(products) {
    const filterText = this.state.filterText;
    const isStockOnly = this.state.isStockOnly;
    let filteredProducts = [...this.props.products];
    
    // filterText
    if (filterText.length) {
      filteredProducts = filteredProducts.filter(product => {
        return product.name.toUpperCase().search(filterText.toUpperCase()) >= 0;
      });
    }
    
    // isStockOnly === true
    if (isStockOnly) {
      filteredProducts = filteredProducts.filter(product => {
        return product.stocked;
      });
    }
    
    return filteredProducts;
  }
  
  render() {
    const filteredProducts = this.doFilter(this.props.products);
    return (
      <div>
        <h1>FilterableProductTable: {filteredProducts.length}</h1>
        <SearchBar
          filterText={this.state.filterText}
          onFilterTextChange={this.handleFilterTextChange}
          isStockOnly={this.state.isStockOnly}
          onIsStockOnlyChange={this.handleIsStockOnlyChange}
        />
        <ProductTable products={filteredProducts} />
      </div>
    );
  }
}

ReactDOM.render(
  <FilterableProductTable products={productList}/>,
  document.getElementById('app')
);
