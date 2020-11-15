import React, { Component } from "react";
import categoryStore from "../stores/categoryStore";
import { addTicket } from "../actions/ticketAction";
import { getCategories } from "../actions/categoryAction";

export default class CreateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      message: "",
      categories: categoryStore.getCategories(),
      ticket: {
        ticket_id: null,
        user_id: null,
        title: "",
        category_id: null,
        body: "",
        created_at: null,
        status: "open",
      },
    };
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    categoryStore.addChangeListener(this.onCategoryChange);
    if (categoryStore.getCategories().length === 0) {
      getCategories();
    }
    return () => {
      categoryStore.removeChangeListener(this.onCategoryChange);
    };
  }

  onCategoryChange() {
    this.setState({ categories: categoryStore.getCategories() });
  }

  handleChange(e) {
    let ticket = this.state.ticket;
    ticket[e.target.name] = e.target.value;
    this.setState({ ticket });
  }

  formIsValid() {
    const errors = {};
    if (!this.state.ticket.title) errors.title = "Title is required";
    if (!this.state.ticket.body) errors.body = "Body is required";
    if (!this.state.ticket.category_id)
      errors.category_id = "Category is required";

    this.setState({ errors });
    // Form is valid if the errors object has no properties
    return Object.keys(errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.formIsValid()) return;
    this.state.categories.map((category) => {
      if (category.category_id === this.state.ticket.category_id) {
        let ticket = this.state.ticket;
        ticket.name = category.name;
        ticket.user_id = this.props.userDetails.user_id;
        this.setState({ ticket });
      }
      return category;
    });
    addTicket(this.state.ticket);
    this.setState({
      ticket: {
        ticket_id: null,
        user_id: this.props.userDetails.user_id,
        title: "",
        category_id: null,
        body: "",
        created_at: null,
        status: "open",
      },
      message: "Ticket Created",
    });
  }

  render() {
    const { errors, message, categories, ticket } = this.state;
    return (
      <div className="container">
        <h1 className="display-4">New Ticket</h1>
        <hr />
        <div className="container col-sm-8">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <label htmlFor="title" className="col-sm-2 col-form-label">
                Title
              </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Title"
                  name="title"
                  id="title"
                  onChange={this.handleChange}
                  value={this.state.ticket.title}
                />
                {errors.title && (
                  <div className="text-danger">{errors.title}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="category_id" className="col-sm-2 col-form-label">
                Category
              </label>
              <div className="col-sm-6">
                <select
                  className="form-control"
                  name="category_id"
                  id="category_id"
                  onChange={this.handleChange}
                >
                  <option> Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <div className="text-danger">{errors.category_id}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="body" className="col-sm-2 col-form-label">
                Body
              </label>
              <div className="col-sm-6">
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Write issue here"
                  name="body"
                  id="body"
                  rows="7"
                  onChange={this.handleChange}
                  value={ticket.body}
                ></textarea>
                {errors.body && (
                  <div className="text-danger">{errors.body}</div>
                )}
              </div>
            </div>

            <div className="form-group row">
              <div className="offset-md-4">
                <input
                  type="submit"
                  value="Open Ticket"
                  className="btn btn-outline-info"
                />
              </div>
            </div>
            {message && <div className="text-success">{message}</div>}
          </form>
        </div>
      </div>
    );
  }
}
