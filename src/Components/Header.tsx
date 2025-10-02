import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

const navigation = [
  { name: "About", href: "#" },
  { name: "Projects", href: "#" },
  { name: "Tech Specs", href: "#" },
  { name: "Work", href: "#" },
];

export default function Header() {
  const [current, setCurrent] = useState("About");

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        
        {/* Left: Logo + Name */}
        <div className="flex items-center gap-2">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=purple&shade=500"
            alt="Logo"
            className="h-7 w-7"
          />
          <span className="font-bold text-lg tracking-wide text-white">
            Rahul Dev
          </span>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setCurrent(item.name)}
              className={`relative text-sm font-semibold tracking-wide px-4 py-2 rounded-full transition-all duration-300 ${
                current === item.name
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right: Call to Action */}
        <div>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-semibold tracking-wide 
                       bg-white text-black px-5 py-2 rounded-full shadow-sm
                       transition-all duration-300 hover:bg-gray-200 hover:scale-105"
          >
            Let's Talk
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}
