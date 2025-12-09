import React from "react";
import { Link } from "react-router-dom";
import Icon from "./AppIcon";

const Breadcrumb = ({ items }) => {
  if (!items || items?.length === 0) return null;

  return (
    <nav className="breadcrumb-container" aria-label="Breadcrumb">
      {items?.map((item, index) => {
        const isLast = index === items?.length - 1;

        return (
          <div key={index} className="breadcrumb-item">
            {!isLast && item?.path ? (
              <Link to={item?.path} className="hover:text-primary">
                {item?.label}
              </Link>
            ) : (
              <span className={isLast ? "active" : ""}>{item?.label}</span>
            )}
            {!isLast && (
              <Icon
                name="ChevronRight"
                size={16}
                className="breadcrumb-separator"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
