import React from 'react'
import { Shield, Lock, Eye, Trash2, Mail, MapPin, Building, Globe, Cookie, ShieldCheck } from 'lucide-react'

export const PrivacyPolicy = () => {
  const lastUpdated = "April 8, 2026"

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-24 overflow-hidden mb-16">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-300 text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Your Privacy Matters
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            At Dosro-Deal, we are committed to protecting your personal information and your right to privacy.
          </p>
          <p className="mt-8 text-slate-400 text-sm italic">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Intro */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100 mb-12">
          <p className="text-slate-600 leading-relaxed text-lg mb-0 text-justify">
            This Privacy Policy describes how Dosro-Deal (referred to as "we", "us", or "our") collects, uses, and shares your personal information when you visit or use our platform. By using our services, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        {/* Data Collection */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Information We Collect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataCard 
              title="Personal Identifiers" 
              list={["Full Names", "Email Addresses", "Physical/Shipping Address", "Login Information"]}
              icon={<ShieldCheck className="w-5 h-5 text-green-500" />}
            />
            <DataCard 
              title="Technical Data" 
              list={["IP Address", "Browser Type", "Device Information"]}
              icon={<Globe className="w-5 h-5 text-blue-500" />}
            />
            <DataCard 
              title="Financial Data" 
              list={["Payment Information", "Transaction History"]}
              icon={<Lock className="w-5 h-5 text-amber-500" />}
            />
            <DataCard 
              title="Usage Data" 
              list={["How you interact with our site", "Search history", "Wishlist items"]}
              icon={<Eye className="w-5 h-5 text-indigo-500" />}
            />
          </div>
        </section>

        {/* Why we collect */}
        <section className="mb-12 bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 underline decoration-primary/30 decoration-4 underline-offset-8">Why We Collect This Information</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">1</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Service Delivery</h3>
                <p className="text-slate-600">To process transactions, manage orders, and deliver items to your physical address. Your login info is essential for account security.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Marketing Purposes</h3>
                <p className="text-slate-600">With your consent, we use your email to send updates about new treasures, special offers, and personalized recommendations.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">3</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Platform Improvement</h3>
                <p className="text-slate-600">Technical data like IP addresses help us monitor site performance, prevent fraud, and enhance the overall user experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Third Parties */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Who We Share Your Data With</h2>
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
             <p className="text-slate-300 mb-8 leading-relaxed">
               We do not sell your personal data. We only share information with trusted third parties who assist us in operating our platform and serving you:
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                 <h4 className="font-bold text-white mb-2">Payment Providers</h4>
                 <p className="text-slate-400 text-sm">To securely process your payments without Dosro-Deal ever storing your full credit card details.</p>
               </div>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                 <h4 className="font-bold text-white mb-2">Google Analytics</h4>
                 <p className="text-slate-400 text-sm">To understand website traffic and user behavior to improve our marketplace experience.</p>
               </div>
             </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-12 bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Cookie className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center md:text-left">Cookies and Tracking</h2>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>
        </section>

        {/* User Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Rights & Control</h2>
          <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100">
            <div className="flex items-center gap-4 mb-6">
               <Trash2 className="w-6 h-6 text-indigo-600" />
               <h3 className="text-xl font-bold text-indigo-900">Right to Deletion</h3>
            </div>
            <p className="text-indigo-800/80 mb-0">
              You have the right to request the deletion of your personal data that we have collected. If you wish to close your account and have your information removed from our servers, please contact us at the email address provided below. We will respond to your request within a reasonable timeframe.
            </p>
          </div>
        </section>

        {/* Data Controller */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Data Controller & Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <Building className="w-6 h-6 text-primary mx-auto md:mx-0" />
              <h4 className="font-bold text-slate-900">Organization</h4>
              <p className="text-slate-600 text-sm">DosroDeal Marketplace</p>
            </div>
            <div className="space-y-3">
              <MapPin className="w-6 h-6 text-primary mx-auto md:mx-0" />
              <h4 className="font-bold text-slate-900">Headquarters</h4>
              <p className="text-slate-600 text-sm">Pokhara, Nepal</p>
            </div>
            <div className="space-y-3">
              <Mail className="w-6 h-6 text-primary mx-auto md:mx-0" />
              <h4 className="font-bold text-slate-900">Email Support</h4>
              <p className="text-slate-600 text-sm">dosrodeal66@gmail.com</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

const DataCard = ({ title, list, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <ul className="space-y-2">
      {list.map((item, i) => (
        <li key={i} className="text-slate-500 text-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          {item}
        </li>
      ))}
    </ul>
  </div>
)
