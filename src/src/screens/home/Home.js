import React, { Component } from "react";
import Header from "./../../common/header/Header";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateSearchRestaurant = (searchRestaurant, searchOn) => {};

  render() {
    return (
      <div>
        <Header
          homeOptions="true"
          baseUrl={this.props.baseUrl}
          updateSearchRestaurant={this.updateSearchRestaurant}
        />
      </div>
    );
  }
}

export default Home;
