import React from 'react'
import {
  FileText,
  ShieldCheck,
  ShoppingCart,
  Truck,
  CreditCard,
  RefreshCcw,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Mail,
  MapPin,
  Building
} from 'lucide-react'

export const TermsOfService = () => {
  const lastUpdated = "April 8, 2026"

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-24 overflow-hidden mb-16">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-300 text-sm font-medium mb-6">
            <FileText className="w-4 h-4 mr-2" />
            Terms of Service
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-6">Agreement to Terms</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Please read these terms carefully before using the DosroDeal marketplace.
          </p>
          <p className="mt-8 text-slate-400 text-sm italic">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* 1. Identification */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Building className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">1. Business Identification</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            DosroDeal ("we", "us", or "our") is a multi-vendor marketplace platform headquartered in Pokhara, Nepal. We provide a platform for users to buy and sell pre-loved and second-hand items. By accessing or using our website, you agree to be bound by these Terms of Service.
          </p>
        </section>

        {/* 2. Service Description */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">2. Description of Service</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600">
            <p>
              DosroDeal provides an online venue where individual sellers ("Vendors") can list items for sale and buyers can purchase them. We facilitate the transaction but are not the seller of the items listed by third-party vendors.
            </p>
            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">Conditions of Use:</h3>
            <ul className="list-disc pl-5 space-y-2">

              <li>You agree to provide accurate and complete registration information.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Illegal, offensive, or counterfeit items are strictly prohibited from the marketplace.</li>
            </ul>
          </div>
        </section>

        {/* 3. Purchase & Payment */}
        <section className="mb-12 bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">3. Payments & Transactions</h2>
          </div>
          <p className="text-slate-600 mb-6">
            When you make a purchase on DosroDeal, you agree to the following payment terms:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
              <h4 className="font-bold text-slate-800 mb-2">Payment Methods</h4>
              <p className="text-sm text-slate-500">We support secure payments via local digital wallets (e.g., eSewa). We also offer Cash on Delivery (COD) for selected items.
                All transactions are processed through encrypted third-party providers.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
              <h4 className="font-bold text-slate-800 mb-2">Service Fees</h4>
              <p className="text-sm text-slate-500">DosroDeal may charge a small commission or service fee on completed transactions to maintain the platform's operations.</p>
            </div>
          </div>
        </section>

        {/* 4. Delivery & Warranty */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-slate-900">4. Delivery Terms</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Delivery is handled by our logistics partners or the vendors themselves. Standard delivery times range from 2-7 business days depending on your location in Nepal. Shipping costs are calculated at checkout.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-slate-900">5. Warranty</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                As a marketplace for pre-loved items, most products are sold "as-is." However, vendors may offer specific warranties on electronics or high-value items, which will be clearly stated in the product description.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Returns & Refunds */}
        <section className="mb-12 bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">6. Returns & Refunds</h2>
          </div>
          <div className="space-y-4 text-slate-300">
            <p>We want you to be happy with your purchase. Our marketplace refund policy includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="text-white font-bold">Withdrawal Rights:</span> Customers have the right to cancel an order before it has been shipped.</li>
              <li><span className="text-white font-bold">Return Eligibility:</span> Items can be returned within 3 days if they are significantly not as described or damaged upon arrival.</li>
              <li><span className="text-white font-bold">Refund Process:</span> Once a return is approved, the refund is processed back to your original payment method within 5-10 business days.</li>
            </ul>
          </div>
        </section>

        {/* 7. Safety & Proper Use */}
        <section className="mb-12 bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <h2 className="text-2xl font-bold text-slate-900">7. Safety Information</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-0">
            Users must use the platform and purchased items safely and responsibly. Please follow all manufacturer instructions for any technical equipment or electronics. DosroDeal is not liable for injuries resulting from the improper use of items purchased through the marketplace.
          </p>
        </section>

        {/* 8. Customer Rights */}
        <section className="mb-12 px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">8. Your Rights as a Customer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <UserCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">Transparency</h4>
              <p className="text-slate-500 text-xs mt-2">Right to clear and accurate pricing info.</p>
            </div>
            <div className="text-center p-4">
              <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">Security</h4>
              <p className="text-slate-500 text-xs mt-2">Right to protected and secure transactions.</p>
            </div>
            <div className="text-center p-4">
              <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">Support</h4>
              <p className="text-slate-500 text-xs mt-2">Right to responsive customer service.</p>
            </div>
          </div>
        </section>

        {/* 9. Contact */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">9. Contact & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <Building className="w-6 h-6 text-primary mx-auto md:mx-0" />
              <h4 className="font-bold text-slate-900">Marketplace</h4>
              <p className="text-slate-600 text-sm">DosroDeal Admin Team</p>
            </div>
            <div className="space-y-3">
              <MapPin className="w-6 h-6 text-primary mx-auto md:mx-0" />
              <h4 className="font-bold text-slate-900">Location</h4>
              <p className="text-slate-600 text-sm">Pokhara, Nepal</p>
            </div>
            <div className="space-y-3">
              <Mail className="w-6 h-6 text-primary mx-auto md:mx-0" />
              <h4 className="font-bold text-slate-900">Email Address</h4>
              <p className="text-slate-600 text-sm underline group pointer-events-auto">dosrodeal66@gmail.com</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
