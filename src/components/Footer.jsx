import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-t border-purple-500/20 mt-auto relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-pink-400 bg-clip-text text-transparent mb-4">
              YourHackBuddy
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Connect with talented developers, designers, and innovators. Build amazing projects together and win hackathons as a team.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: 'twitter', path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
                { icon: 'github', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                { icon: 'linkedin', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                { icon: 'discord', path: 'M19.27 5.33c-1.01-.469-2.094-.766-3.225-.893a.09.09 0 0 0-.078.037c-.22.385-.444.832-.608 1.25a8.44 8.44 0 0 0-2.45-.338c-.85 0-1.69.113-2.49.338-.163-.418-.387-.865-.607-1.25a.09.09 0 0 0-.079-.037c-1.13.127-2.214.424-3.224.893a.07.07 0 0 0-.032.027C3.79 7.82 3.06 12.3 3.36 16.67a.082.082 0 0 0 .031.057c1.534 1.117 3.025 1.729 4.506 2.053a.09.09 0 0 0 .086-.035c.355-.51.67-1.054.936-1.625a.09.09 0 0 0-.044-.119 5.9 5.9 0 0 1-.86-.426c-.072-.05-.048-.08.034-.12.35-.16.7-.34 1.02-.55.042-.03.084-.01.098.034a9.75 9.75 0 0 0 1.28 1.59.09.09 0 0 0 .13.006c.438-.44.84-.92 1.19-1.44a.09.09 0 0 0 .005-.11 5.22 5.22 0 0 1-.52-.803c-.024-.05.015-.08.06-.07.4.08.81.13 1.22.15.44.02.88 0 1.31-.06.05-.01.085.02.06.07-.13.265-.27.52-.43.77a.09.09 0 0 0 .006.11c.35.52.75 1 1.19 1.44a.09.09 0 0 0 .13-.006c.41-.44.79-.91 1.13-1.42.03-.05.07-.05.1-.02.21.26.43.51.66.74.08.07.17.13.25.19.07.05.1.03.1-.04v-.01s1.79-5.91 1.8-8.33c.01-3.29-2.07-5.11-4.02-5.35a.07.07 0 0 0-.03-.01zm-8.2 9.93c-1.03 0-1.89-.92-1.89-2.04 0-1.12.84-2.04 1.89-2.04 1.06 0 1.9.92 1.89 2.04 0 1.12-.83 2.04-1.89 2.04zm6.44 0c-1.03 0-1.89-.92-1.89-2.04 0-1.12.84-2.04 1.89-2.04 1.06 0 1.9.92 1.89 2.04 0 1.12-.83 2.04-1.89 2.04z' },
              ].map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-purple-400 hover:bg-purple-900/30 hover:text-purple-300 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-purple-900/20"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Hackathons Section */}
          <div className="space-y-3">
            <h4 className="text-purple-300 font-semibold text-lg mb-3">Hackathons</h4>
            <ul className="space-y-2">
              <li><Link to="/hackathons" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Current Challenges</Link></li>
              <li><Link to="/hackathons/past" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Past Events</Link></li>
              <li><Link to="/hackathons/create" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Host a Hackathon</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Leaderboard</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Featured Projects</Link></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-3">
            <h4 className="text-purple-300 font-semibold text-lg mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Blog</Link></li>
              <li><Link to="/docs" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Documentation</Link></li>
              <li><Link to="/tutorials" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Tutorials</Link></li>
              <li><Link to="/templates" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Starter Templates</Link></li>
              <li><Link to="/api" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">API Reference</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-3">
            <h4 className="text-purple-300 font-semibold text-lg mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/conduct" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Code of Conduct</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} YourHackBuddy. All rights reserved.
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Made with</span>
            <svg
              className="w-5 h-5 text-pink-500 animate-heartbeat"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-400 text-sm">for hackers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  