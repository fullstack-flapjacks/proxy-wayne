import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import MenuSection from './components/MenuSection';
import MenuButtons from './components/MenuButtons';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantID: '',
      restaurantMenus: ['Breakfast', 'Lunch', 'Dinner'],
      restaurantMenuCategories: ['Appetizers', 'Mains', 'Sides', 'Beverages'],
      restaurantMenuItems: [],
      selectedMenu: [],
      updatedAt: '',
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentWillMount() {
    this.handleRestaurantID();
  }
  componentDidMount() {
    this.fetch();
  }

  fetch() {
    // fetches data associated with id
    axios
      .get(`http://localhost:6600${this.state.restaurantID}menu`)
      .then((restaurantMenu) => {
        console.log(`${this.state.restaurantID} data fetched`);
        console.log(restaurantMenu.data);
        this.setState({
          restaurantMenuItems: restaurantMenu.data,
          updatedAt: restaurantMenu.data[0].updatedAt.slice(0, 10),
        });
        // first menu to show on page reload
        this.handleMenuClick(this.state.restaurantMenus[0]);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }

  handleRestaurantID() {
    // grabs id from url
    const id = window.location.pathname;
    this.setState({
      restaurantID: id,
    });
  }

  handleMenuState(organizedMenu) {
    this.setState({ selectedMenu: organizedMenu });
  }

  handleMenuClick(menu) {
    // updates state with selected menu button
    const callback = this.handleMenuState.bind(this);
    this.filterRestaurantData(menu, callback);
    console.log(menu, 'menu was selected');
  }

  filterRestaurantData(menu, cb) {
    // filters restaurants menu items to selected menu
    const { restaurantMenuItems } = this.state;
    const filteredMenu = [];

    for (let i = 0; i < restaurantMenuItems.length; i += 1) {
      if (restaurantMenuItems[i].menuName === menu) {
        filteredMenu.push(restaurantMenuItems[i]);
      }
    }
    this.organizeMenuData(filteredMenu, cb);
  }

  organizeMenuData(menu, cb) {
    // orders filtered menu list by category name
    const restaurantMenu = [];
    const categoryNames = this.state.restaurantMenuCategories;

    for (let x = 0; x < categoryNames.length; x += 1) {
      const category = [];
      for (let y = 0; y < menu.length; y += 1) {
        if (menu[y].menuCategoryName === categoryNames[x]) {
          category.push(menu[y]);
        }
      }
      restaurantMenu.push(category);
    }
    cb(restaurantMenu);
  }

  render() {
    return (
      <div id="menu-container">
        <h2 className="menu-title">Menu</h2>
        <div className="menu-nav">
          <MenuButtons menuNames={this.state.restaurantMenus} menuClick={this.handleMenuClick} />
        </div>
        <div className="menu-section">
          <MenuSection menuCategories={this.state.selectedMenu} />
        </div>
        <div className="footer">
          <span>Last updated: {this.state.updatedAt}</span>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('menu'));

// export default App;
