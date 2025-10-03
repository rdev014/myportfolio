import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Tech Specs", href: "#tech" },
  { name: "Work", href: "#work" },
];

export default function Header() {
  const [current, setCurrent] = useState("About");

  // Handle scroll-based active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map((item) => document.querySelector(item.href));
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setCurrent(navigation[index].name);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    e.preventDefault();
    const element = document.querySelector(item);
    element?.scrollIntoView({ behavior: "smooth" });
    setCurrent(item);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
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
