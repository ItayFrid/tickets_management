import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import categoryStore from "../stores/categoryStore";
import { getCategories, addCategory } from "../actions/categoryAction";
import CategoryItem from "./CategoryItem";
import axios from "axios";

export default class CategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: categoryStore.getCategories(),
      category: { category_id: null, name: "" },
      errors: {},
    };

    this.formIsValid = this.formIsValid.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    categoryStore.addChangeListener(this.onCategoryChange);
    if (categoryStore.getCategories().length === 0) {
      getCategories();
    }
  }

  componentWillUnmount() {
    categoryStore.removeChangeListener(this.onCategoryChange);
  }

  onCategoryChange() {
    this.setState({ categories: categoryStore.getCategories() });
  }

  handleSubmit(e) {
    if (e !== null) {
      e.preventDefault();
    }
    if (!this.formIsValid()) {
      return;
    }
    addCategory(this.state.category);
    this.setState({ category: { category_id: null, name: "" } });
  }

  handleChange(e) {
    axios
      .post("http://tickets/checks/input", { text: e.target.value })
      .then((res) => {
        this.setState({
          category: { ...this.state.category, name: res.data.text },
        });
      });
  }

  formIsValid() {
    const errors = {};
    if (!this.state.category.name) errors.name = "Category name is required";
    this.setState(errors);
    // Form is valid if the errors object has no properties
    return Object.keys(errors).length === 0;
  }

  render() {
    const { categories, errors, category } = this.state;
    if (this.props.userDetails.role !== "support") return <Redirect to="/" />;
    else
      return (
        <div className="container">
          <h1 className="display-3">Categories</h1>
          <hr />
          {categories.map((category) => (
            <CategoryItem key={category.category_id} category={category} />
          ))}
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="body"
              placeholder="Enter Category"
              value={category.name}
              className="form-control"
              onChange={this.handleChange}
            />
            <button type="submit" className={"btn btn-outline-info"}>
              Add Category
            </button>
          </form>
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
      );
  }
}
