import * as React from 'react';
import * as faker from 'faker';
import * as Realm from 'realm';
import * as ReactDataGrid from 'react-data-grid';

const sideRows: any = [];
for (let index = 0; index < 40; index++) {
  sideRows.push((
    <tr key={index}>
      <th scope="row">
        {faker.commerce.productName()}
      </th>
    </tr>
  ));
}

export type Product = {productId: number, price: number, name: string};

export interface AppState {
  products: Realm.Results<Product>;
}

export class App extends React.Component<undefined, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      products: null
    };
  }

  componentDidMount() {
    const self = this;
    if (Realm.Sync.User.current) {
      self.observe(Realm.Sync.User.current);
    } else {
      Realm.Sync.User.login('http://localhost:9080', 'admin.user@realm.io', 'ilovesushi', (err, user) => {
        if (err) { alert(err.toString()); }
        else {
          self.observe(user);
        }
      });
    }
  }

  observe(user: Realm.Sync.User) {
    const realm = new Realm({
      sync: {
        user: user,
        url: `realm://localhost:9080/products`
      }
    });
    const products = realm.objects<Product>('Product');
    console.log(products);
    this.setState({
      products: products
    });
    realm.addListener('change', () => {
      const products = realm.objects<Product>('Product');
      this.setState({
        products: products
      });
    });
  }

  render() {
    const mainRows = this.state.products ? this.state.products.map(p => {
      return (
        <tr key={p.productId}>
          <td>{p.productId}</td>
          <td>{p.price}</td>
          <td>{p.name}</td>
        </tr>);
    }) : [];

    return (
      <div className="container-fluid no-gutter">
        <div className="row">
          <div className="col-sm-3">
            <div className="btn-group btn-block">
              <button type="button" className="btn btn-secondary btn-sm">
                <i className="fa fa-user" />
              </button>
              <button type="button" className="btn btn-secondary btn-sm active">
                <i className="fa fa-database" />
              </button>
              <button type="button" className="btn btn-secondary btn-sm">
                <i className="fa fa-terminal" />
              </button>
            </div>
            <div className="input-group">
              <span className="input-group-addon">+</span>
              <input type="text" className="form-control" placeholder="Search Object Types" />
            </div>
            <table className="table table-sm">
              <tbody>
                {sideRows}
              </tbody>
            </table>
          </div>
          <div className="col-sm-9">
            <div className="input-group">
              <textarea rows={1} className="form-control" placeholder="Search Object Types" />
              <span className="input-group-addon">Filter</span>
            </div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>ProductId</th>
                  <th>Price</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {mainRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
