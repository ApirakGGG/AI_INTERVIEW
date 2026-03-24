import {FaFacebook , FaInstagram , FaGithub , FaYoutube} from 'react-icons/fa';

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: <FaFacebook size={20} /> },
    { name: 'Instagram', href: '#', icon: <FaInstagram size={20} /> },
    { name: 'X', href: '#', icon: <XIcon /> },
    { name: 'GitHub', href: '#', icon: <FaGithub size={20} /> },
  ];

  return (
    <footer className="bg-[#0f172a] text-gray-400 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Copyright Text */}
        <div className="text-sm order-2 md:order-1">
          © {currentYear} Your Company, Inc. All rights reserved.
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6 order-1 md:order-2">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="hover:text-white transition-colors duration-200"
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