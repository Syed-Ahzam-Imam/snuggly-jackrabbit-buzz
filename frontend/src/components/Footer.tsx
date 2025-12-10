import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Founder Clarity Compass. All rights reserved.</p>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-sm hover:text-blue-300 transition-colors duration-200">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-300 transition-colors duration-200">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-300 transition-colors duration-200">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;