import React from "react";

export default function CategoryItem(props) {
  const { category } = props;
  return <div className="my-1">{category.name}</div>;
}
