import React, { Component } from "react";

export default class CategoryItem extends Component {
  render() {
    const { category } = this.props;
    return <div className="my-1">{category.name}</div>;
  }
}
