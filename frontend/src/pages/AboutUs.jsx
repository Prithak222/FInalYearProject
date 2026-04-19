import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  ShoppingBag,
  Zap,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutUs() {
  const [stats, setStats] = useState({
    activeUsers: '10K+',
    itemsSold: '5K+',
    verifiedVendors: '500+',
    userSatisfaction: '4.9/5'
  });

  useEffect(() => {
    fetch('http://localhost:5000/auth/public-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error('Error fetching public stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight text-slate-900">
              Transforming the way we <span className="text-primary italic">Shop & Sell</span> pre-loved treasures.
            </h1>
            <p className="text-xl text-slate-600 font-medium mb-10 leading-relaxed">
              DosroDeal is Pokhara's leading multi-vendor marketplace dedicated to giving quality items a second life. We're building a community where sustainability meets style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/categories" 
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2"
              >
                Explore Marketplace <ArrowRight size={18} />
              </Link>
              <Link 
                to="/vendor/register" 
                className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem number={stats.activeUsers} label="Active Users" />
            <StatItem number={stats.itemsSold} label="Items Sold" />
            <StatItem number={stats.verifiedVendors} label="Verified Vendors" />
            <StatItem number={stats.userSatisfaction} label="User Satisfaction" />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-2xl group-hover:bg-primary/20 transition-all duration-700"></div>
              <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Our Mission" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide uppercase">
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                Empowering the circular economy in Nepal.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                At DosroDeal, we believe that every object has a story yet to be continued. Our platform was born out of a desire to make second-hand shopping as premium and trustworthy as buying new.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <FeatureItem 
                  icon={<Target size={20} />} 
                  title="Sustainability" 
                  desc="Reducing waste by promoting item reuse."
                />
                <FeatureItem 
                  icon={<ShieldCheck size={20} />} 
                  title="Trust" 
                  desc="Verified vendors and secure payments."
                />
                <FeatureItem 
                  icon={<Heart size={20} />} 
                  title="Community" 
                  desc="Supporting local sellers and buyers."
                />
                <FeatureItem 
                  icon={<Zap size={20} />} 
                  title="Ease of Use" 
                  desc="Modern tools for seamless trading."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">Built on Strong Values</h2>
            <p className="text-slate-400 font-medium">We're more than just a marketplace; we're a movement towards smarter consumption.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<ShoppingBag className="text-primary" />}
              title="Quality Over Quantity"
              desc="We curate the best items and vendors to ensure you get value for your money every single time."
            />
            <ValueCard 
              icon={<Globe className="text-indigo-400" />}
              title="Global Standards"
              desc="Bringing world-class e-commerce features and aesthetics to the Nepalese second-hand market."
            />
            <ValueCard 
              icon={<Users className="text-emerald-400" />}
              title="Seller Success"
              desc="We provide our vendors with powerful tools and analytics to help their small businesses thrive."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
                Ready to find your <br /> next favorite thing?
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <Link 
                  to="/categories" 
                  className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl active:scale-95"
                >
                  Start Shopping Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="text-center group">
      <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter group-hover:text-primary transition-colors duration-500">{number}</div>
      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-10 rounded-[32px] hover:bg-slate-800 transition-all duration-500 hover:-translate-y-2 group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
