import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/rahul-dev-516906225/", icon: <Linkedin className="w-6 h-6" /> },
    { name: "Twitter", href: "https://x.com/rdev01431", icon: <Twitter className="w-6 h-6" /> },
    { name: "GitHub", href: "https://github.com/rdev014", icon: <Github className="w-6 h-6" /> },
    // { name: "Instagram", href: "https://instagram.com/yourprofile", icon: <Instagram className="w-6 h-6" /> },
  ];

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Tech Specs", href: "#tech" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative bg-black text-white pt-20">
      {/* Subtle background lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[1px] h-full bg-white/5 animate-pulse-slow"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/5 animate-pulse-slower"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 z-10">
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_white]">
            Rahul Dev
          </h2>
          <p className="text-gray-400 max-w-xs">
            Crafting bold, modern, and high-impact web experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide text-white">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="relative group text-white hover:text-cyan-400 transition-all duration-300 font-semibold"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide text-white">Follow Me</h3>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-900 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_white]"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Me / Bold Call-to-Action */}
        <div className="space-y-4 flex flex-col justify-between">
          <h3 className="text-xl font-semibold tracking-wide text-white">Get in Touch</h3>
          <p className="text-gray-400 max-w-xs">
            Interested in collaborating? Let’s build something amazing together.
          </p>
          <a
            href="#contact"
            className="mt-4 inline-block px-6 py-3 text-white font-bold bg-cyan-500 rounded-lg hover:bg-cyan-600 shadow-lg transition-all duration-300 text-center"
          >
            Contact Me
          </a>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm z-10 relative">
        &copy; {new Date().getFullYear()} Rahul Dev. All rights reserved.
      </div>
    </footer>
  );
}
