import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-white/5 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-lg shadow-white/5 group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                <span className="font-black text-xl text-slate-900">D</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">DosroDeal</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Give your items a second life. The most trusted multi-vendor marketplace for pre-loved treasures.
            </p>
            <div className="flex items-center space-x-4">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Marketplace</h4>
            <ul className="space-y-4">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/categories" label="All Categories" />
              <FooterLink to="/wishlist" label="My Wishlist" />
              <FooterLink to="/vendor/register" label="Become a Vendor" />
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Support</h4>
            <ul className="space-y-4">
              <FooterLink to="#" label="Help Center" />
              <FooterLink to="#" label="Safety Guidelines" />
              <FooterLink to="#" label="Contact Us" />
              <FooterLink to="#" label="Feedback" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Get in Touch</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3 text-slate-400">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Pokhara, Nepal<br /></span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+977 9806776734</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>dosrodeal66@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-medium text-slate-500 uppercase tracking-widest">
          <p>© {currentYear} DosroDeal. All rights reserved.</p>
          <div className="flex items-center space-x-8">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-slate-400 hover:text-primary text-sm font-medium transition-all duration-300 flex items-center group"
      >
        <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
        <span>{label}</span>
      </Link>
    </li>
  )
}

function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300"
    >
      {icon}
    </a>
  )
}
