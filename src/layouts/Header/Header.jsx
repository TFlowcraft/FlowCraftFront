import React from "react";
import { headerItems } from "../../resources/data/resources.js";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">
        FlowCraft
      </a>
      <nav>
        <ul className="header-list">
          {headerItems.map((item) => (
            <li key={item.id} className="header-item">
              <a href={item.link} className="header-link">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
