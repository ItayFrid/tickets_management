import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";
import categoryStore from "../stores/categoryStore";
import { getCategories, addCategory } from "../actions/categoryAction";
import { getUserDetails } from "../actions/userAction";
import CategoryItem from "./CategoryItem";

export default function CategoriesPage() {
  const { authTokens } = useAuth();
  const [categories, setCategories] = useState(categoryStore.getCategories());
  const [category, setCategory] = useState({ category_id: null, name: "" });
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({});

  /**
   * Checks if form is valid
   */
  function formIsValid() {
    const _errors = {};
    if (!category.name) _errors.name = "Category name is required";
    setErrors(_errors);
    // Form is valid if the errors object has no properties
    return Object.keys(_errors).length === 0;
  }

  useEffect(() => {
    getUserDetails(authTokens.session_id).then((res) => {
      setUserDetails(res.data);
      // Checks if user is support
      if (userDetails.role !== "support") {
        return <Redirect to="/" />;
      }
    });
    categoryStore.addChangeListener(onCategoryChange);
    if (categoryStore.getCategories().length === 0) getCategories();
    return () => categoryStore.removeChangeListener(onCategoryChange);
  }, [authTokens.session_id, userDetails.role]);

  function onCategoryChange() {
    setCategories(categoryStore.getCategories());
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formIsValid()) return;
    addCategory(category);
    setCategories([...categories, category]);
    setCategory({ category_id: null, name: "" });
  }

  function handleChange(e) {
    setCategory({ category_id: null, name: e.target.value });
  }

  return (
    <div className="container">
      <h1 className="display-3">Categories</h1>
      <hr />
      {categories.map((category) => (
        <CategoryItem key={category.category_id} category={category} />
      ))}
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          type="text"
          name="body"
          placeholder="Enter Category"
          value={category.name}
          className="form-control"
          onChange={handleChange}
        />
        <button type="submit" className={"btn btn-outline-info"}>
          Add Category
        </button>
      </form>
      {errors.name && <div className="text-danger">{errors.name}</div>}
    </div>
  );
}
