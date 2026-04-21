import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function ContactUs() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.subject || !formData.description) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        showToast('Please log in to send a message', 'error');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast('Message sent to admin successfully!', 'success');
        setFormData({ subject: '', description: '' });
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to send message', 'error');
      }
    } catch (err) {
      console.error('Error sending contact message:', err);
      showToast('Connection error. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Get in Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
            We're here to <span className="text-primary italic">help.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Have a question, feedback, or need to report a problem? Our team is dedicated to providing you with the best support.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Contact Info Column */}
          <div className="lg:col-span-5 space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
              <ContactCard 
                icon={<Mail className="w-6 h-6" />}
                title="Email Us"
                content="dosrodeal66@gmail.com"
                subContent="Expect a response within 24 hours"
              />
              <ContactCard 
                icon={<Phone className="w-6 h-6" />}
                title="Call Support"
                content="+977 9806776734"
                subContent="Available Mon-Fri, 9am - 6pm"
              />
              <ContactCard 
                icon={<MapPin className="w-6 h-6" />}
                title="Our Location"
                content="Pokhara, Nepal"
                subContent="Visit our headquarters"
              />
            </div>

            {/* Support Stats/Badges */}
            <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/30 transition-colors duration-500"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-xl tracking-tight">Priority Support</h4>
                    <p className="text-slate-400 text-sm font-medium">For verified vendors and active customers.</p>
                  </div>
                </div>
                <div className="h-px w-full bg-white/10"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black text-white">4.9/5</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CSAT Score</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">2h</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Avg Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Send us a Message</h3>
                </div>
                <p className="text-slate-500 font-medium">Your message will be sent directly to our admin panel for review.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Subject of Inquiry</label>
                    <input 
                      type="text" 
                      placeholder="What can we help you with?"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-300"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your Message</label>
                  <textarea 
                    rows="6" 
                    placeholder="Tell us everything about the problem or question you have..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-300 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-slate-50 flex items-center gap-3 text-slate-400">
                <Clock size={16} />
                <p className="text-xs font-medium italic">We typically respond within 2-4 business hours.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, content, subContent }) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</h4>
        <p className="text-xl font-black text-slate-900 tracking-tight mb-1">{content}</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subContent}</p>
      </div>
    </div>
  );
}
