import React, { useState, useEffect } from "react";
import categoryStore from "../stores/categoryStore";
import { addTicket } from "../actions/ticketAction";
import { useAuth } from "../context/auth";
import { getCategories } from "../actions/categoryAction";

function CreateTicket() {
  const { authTokens } = useAuth();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState();
  const [categories, setCategories] = useState(categoryStore.getCategories());
  const [ticket, setTicket] = useState({
    ticket_id: null,
    user_id: authTokens.user_id,
    title: "",
    category_id: null,
    body: "",
    created_at: null,
    status: "open",
  });

  useEffect(() => {
    categoryStore.addChangeListener(onChange);
    if (categories.length === 0) getCategories();
    return () => categoryStore.removeChangeListener(onChange);
  }, [categories.length]);

  function onChange() {
    setCategories(categoryStore.getCategories());
  }

  function handleChange({ target }) {
    setTicket({ ...ticket, [target.name]: target.value });
  }

  function formIsValid() {
    const _errors = {};
    if (!ticket.title) _errors.title = "Title is required";
    if (!ticket.body) _errors.body = "Body is required";
    if (!ticket.category_id) _errors.category_id = "Category is required";

    setErrors(_errors);
    // Form is valid if the errors object has no properties
    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    categories.map((category) => {
      if (category.category_id === ticket.category_id)
        ticket.name = category.name;
      return category;
    });
    addTicket(ticket);
    setTicket({
      ticket_id: null,
      user_id: authTokens.user_id,
      title: "",
      category_id: null,
      body: "",
      created_at: null,
      status: "open",
    });
    setMessage("Ticket Created");
  }

  return (
    <div className="container">
      <h1 className="display-4">New Ticket</h1>
      <hr />
      <div className="container col-sm-8">
        <form onSubmit={handleSubmit}>
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
                onChange={handleChange}
                value={ticket.title}
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
                onChange={handleChange}
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
                onChange={handleChange}
                value={ticket.body}
              ></textarea>
              {errors.body && <div className="text-danger">{errors.body}</div>}
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

export default CreateTicket;
