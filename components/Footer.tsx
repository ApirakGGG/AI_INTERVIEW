import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", href: "#", icon: <FaFacebook size={18} /> },
    { name: "Instagram", href: "#", icon: <FaInstagram size={18} /> },
    { name: "X", href: "#", icon: <XIcon /> },
    { name: "GitHub", href: "#", icon: <FaGithub size={18} /> },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Copyright Text */}
        <div className="text-xs font-mono order-2 md:order-1 text-neutral-500">
          © {currentYear} Your Company, Inc. All rights reserved.
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5 order-1 md:order-2">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="text-neutral-500 hover:text-white transition-colors duration-200"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;