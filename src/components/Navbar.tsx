"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">ICFR</div>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/"
              className={`text-white hover:text-gray-200 ${
                pathname === "/" ? "font-bold underline" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`text-white hover:text-gray-200 ${
                pathname === "/about" ? "font-bold underline" : ""
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`text-white hover:text-gray-200 ${
                pathname === "/contact" ? "font-bold underline" : ""
              }`}
            >
              Contact
            </Link>
          </li>
          {status === "loading" ? (
            <li className="text-white">Loading...</li>
          ) : session ? (
            <>
              <li className="text-white">
                Welcome, {session.user?.firstName}!
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="text-white hover:text-gray-200"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className={`text-white hover:text-gray-200 ${
                    pathname === "/login" ? "font-bold underline" : ""
                  }`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className={`text-white hover:text-gray-200 ${
                    pathname === "/signup" ? "font-bold underline" : ""
                  }`}
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
