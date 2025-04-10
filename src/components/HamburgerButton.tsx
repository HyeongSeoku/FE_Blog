"use client";

import { useState } from "react";
import "@/styles/hamburger.css";
import Link from "next/link";
import MenuIcon from "@/icon/menu.svg";

const HamburgerButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((state) => !state);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="hamburger-container" onClick={toggleMenu}>
        <MenuIcon style={{ width: 18, height: 18 }} fill="black" />
      </button>

      <div
        className={`fixed top-0 left-0 w-full h-full flex flex-col bg-white shadow-lg transition-all duration-300 transform ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {isOpen && (
          <nav>
            <ul
              className={`flex flex-col transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <li className="px-4 py-2 cursor-pointer flex">
                <Link
                  href="/"
                  className="w-full h-full"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </li>
              <li className="px-4 py-2 cursor-pointer flex">
                <Link
                  href="/blog"
                  className="w-full h-full"
                  onClick={handleLinkClick}
                >
                  Blog
                </Link>
              </li>
              <li className="px-4 py-2 cursor-pointer flex">
                <Link
                  href="/login"
                  className="w-full h-full"
                  onClick={handleLinkClick}
                >
                  Resume
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};

export default HamburgerButton;
