// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";

// export default function Navbar() {
//   const pathname = usePathname();
//   const { data: session, status } = useSession();

//   return (
//     <nav className="bg-blue-600 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="text-white font-bold text-xl">ICFR</div>
//         <ul className="flex space-x-4">
//           <li>
//             <Link
//               href="/"
//               className={`text-white hover:text-gray-200 ${
//                 pathname === "/" ? "font-bold underline" : ""
//               }`}
//             >
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link
//               href="/about"
//               className={`text-white hover:text-gray-200 ${
//                 pathname === "/about" ? "font-bold underline" : ""
//               }`}
//             >
//               About
//             </Link>
//           </li>
//           <li>
//             <Link
//               href="/contact"
//               className={`text-white hover:text-gray-200 ${
//                 pathname === "/contact" ? "font-bold underline" : ""
//               }`}
//             >
//               Contact
//             </Link>
//           </li>
//           {status === "loading" ? (
//             <li className="text-white">Loading...</li>
//           ) : session ? (
//             <>
//               <li className="text-white">
//                 Welcome, {session.user?.firstName}!
//               </li>
//               <li>
//                 <button
//                   onClick={() => signOut()}
//                   className="text-white hover:text-gray-200"
//                 >
//                   Logout
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li>
//                 <Link
//                   href="/login"
//                   className={`text-white hover:text-gray-200 ${
//                     pathname === "/login" ? "font-bold underline" : ""
//                   }`}
//                 >
//                   Login
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/signup"
//                   className={`text-white hover:text-gray-200 ${
//                     pathname === "/signup" ? "font-bold underline" : ""
//                   }`}
//                 >
//                   Signup
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// }



'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export const Navbar = () => {

  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="relative z-50 bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">
            SOP<span className="text-purple-400">AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-gray-300">
          <Link href="#home" className="hover:text-purple-400 transition">
            Home
          </Link>
          <Link href="#features" className="hover:text-purple-400 transition">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-purple-400 transition">
            Pricing
          </Link>
          <Link href="#generate" className="hover:text-purple-400 transition">
            Generate SOP
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link href="/login" className="px-4 py-2 text-white hover:text-purple-400 transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};
