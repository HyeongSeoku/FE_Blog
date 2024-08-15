"use client";

import { useState } from "react";
import "@/styles/hamburger.css";
import Link from "next/link";
import Image from "next/image";
import HamburgerIcon from "@/icon/hamburger.svg";

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
      {!isOpen && (
        <button className="hamburger-container" onClick={toggleMenu}>
          <HamburgerIcon width={15} height={20} fill="black" />
        </button>
      )}

      <div
        className={`fixed top-0 left-0 w-full h-full flex flex-col bg-white shadow-lg transition-all duration-300 transform ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {isOpen && (
          <button className="py-2 px-4 ml-auto" onClick={toggleMenu}>
            X
          </button>
        )}
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
                href="/about"
                className="w-full h-full"
                onClick={handleLinkClick}
              >
                About
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer flex">
              <Link
                href="/login"
                className="w-full h-full"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HamburgerButton;
