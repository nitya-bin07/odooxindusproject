import {
  ArrowRight,
  Box,
  Clock,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Shield,X,Check,Boxes
} from "lucide-react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/";
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

  const rows = [
    { feature: "Real-time Stock Updates", manual: false, invhub: true },
    { feature: "Warehouse Transfers Tracking", manual: false, invhub: true },
    { feature: "Centralized Inventory System", manual: false, invhub: true },
    { feature: "Inventory Counting Support", manual: false, invhub: true },
    { feature: "Stock Receipts & Deliveries", manual: false, invhub: true },
    { feature: "Error Prone Processes", manual: true, invhub: false },
    { feature: "Time Consuming Operations", manual: true, invhub: false },
  ];

export default function LandingPage() {

const navigate = useNavigate();

  return (
    <div className="min-h-screen text-gray-200 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]">

      {/* NAVBAR */}
      <nav className="fixed w-full bg-[#020617]/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">InvHub</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-gray-400 hover:text-white transition">
              About
            </a>
            <a href="#features" className="text-gray-400 hover:text-white transition">
              Features
            </a>
            <a href="#snapshot" className="text-gray-400 hover:text-white transition">
              Dashboard
            </a>
            <a href="#comparison" className="text-gray-400 hover:text-white transition">
              Benefits
            </a>
          </div>

          <button onClick={() => navigate("/login")} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-medium transition">
            Get Started
          </button>

        </div>
      </nav>

      {/* HERO */}
     <section
      id="hero"
      className="w-full py-24 px-6 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div className="text-white">

          {/* Badge */}
          
          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.2}
          >
            Digitize Your <br />
            Warehouse Inventory <br />
            Operations
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            className="text-lg text-slate-400 mb-8 max-w-xl"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
          >
            Replace manual registers and Excel sheets with a centralized
            inventory platform. Track stock receipts, deliveries,
            warehouse transfers, and inventory counts in real time.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-wrap gap-4"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
          >

            <a
              href="#features"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-full font-semibold transition shadow-lg shadow-indigo-600/30"
            >
              Explore Features
            </a>

          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-10 mt-12 text-sm"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.65}
          >

            <div>
              <p className="text-2xl font-bold text-white">Real-Time</p>
              <p className="text-slate-400">Stock Visibility</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-slate-400">Digital Tracking</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">Fast</p>
              <p className="text-slate-400">Warehouse Operations</p>
            </div>

          </motion.div>

        </div>

        {/* RIGHT IMAGE AREA */}
        <motion.div
          className="relative h-[500px]"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          {/* Main Image */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <img
              src="https://images.unsplash.com/photo-1553413077-190dd305871c"
              alt="Warehouse"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Card */}
          

        </motion.div>

      </div>
    </section>

       <section
      id="about"
      className="w-full py-20 px-6 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* LEFT SIDE LAYERED IMAGES */}
        <motion.div
          className="relative h-[420px] lg:h-[480px]"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          {/* Image 1 */}
          <div className="absolute left-0 top-10 rotate-[-8deg] shadow-2xl rounded-2xl overflow-hidden w-[70%] h-[260px] border border-slate-700">
            <img
              src="https://images.unsplash.com/photo-1553413077-190dd305871c"
              alt="Warehouse"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image 2 */}
          <div className="absolute right-0 top-0 rotate-[6deg] shadow-2xl rounded-2xl overflow-hidden w-[70%] h-[260px] border border-slate-700">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
              alt="Inventory"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image 3 */}
          <div className="absolute left-16 bottom-0 rotate-[3deg] shadow-2xl rounded-2xl overflow-hidden w-[65%] h-[230px] border border-slate-700">
            <img
              src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
              alt="Warehouse operations"
              className="w-full h-full object-cover"
            />
          </div>

        </motion.div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col justify-center">


          {/* Heading */}
          <motion.h2
            className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0.2}
            viewport={{ once: true }}
          >
            Modern Inventory Management for Warehouses
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            className="text-lg text-slate-400 leading-relaxed mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0.3}
            viewport={{ once: true }}
          >
            Our modular Inventory Management System helps businesses replace
            manual registers, Excel sheets, and scattered tracking methods with
            a centralized digital platform. Inventory managers and warehouse
            staff can easily manage stock receipts, deliveries, warehouse
            transfers, and inventory counts in real time while keeping all
            operations organized and transparent.
          </motion.p>

          {/* CARDS */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >

            {/* Goal Card */}
            <motion.div
              variants={fadeUp}
              custom={0.4}
              whileHover={{ y: -8 }}
              className="bg-[#020617]/70 backdrop-blur-md border border-slate-700 rounded-2xl p-6 transition shadow-lg"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Our Goal
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                To simplify warehouse inventory operations by providing a
                user-friendly platform that ensures accurate stock tracking,
                faster workflows, and reliable data for daily warehouse tasks.
              </p>
            </motion.div>

            {/* Impact Card */}
            <motion.div
              variants={fadeUp}
              custom={0.5}
              whileHover={{ y: -8 }}
              className="bg-[#020617]/70 backdrop-blur-md border border-slate-700 rounded-2xl p-6 transition shadow-lg"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Why It Matters
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                By digitizing activities such as receiving goods, transferring
                stock, and performing inventory counts, businesses reduce
                errors, improve operational efficiency, and gain real-time
                visibility of inventory levels.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>

   <section id="features" className="py-24 px-6">

  <div className="max-w-7xl mx-auto">

    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Built for Daily Warehouse Operations
      </h2>

      <p className="text-xl text-gray-400">
        Digitize and streamline all inventory activities in one system
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">

      {[
        {
          icon: Box,
          title: "Stock Receipts",
          desc: "Record incoming stock quickly when goods arrive and keep warehouse inventory updated in real time."
        },
        {
          icon: TrendingUp,
          title: "Stock Deliveries",
          desc: "Track outgoing stock and deliveries accurately to maintain correct inventory levels."
        },
        {
          icon: Zap,
          title: "Warehouse Transfers",
          desc: "Move products between warehouses and locations with full traceability."
        },
        {
          icon: Users,
          title: "Warehouse Operations",
          desc: "Warehouse staff can easily perform picking, shelving, and stock handling tasks."
        },
        {
          icon: BarChart3,
          title: "Inventory Counting",
          desc: "Perform cycle counts and stock verification directly in the system without manual registers."
        },
        {
          icon: Shield,
          title: "Centralized Inventory System",
          desc: "Replace Excel sheets and paper records with a single reliable inventory platform."
        }
      ].map((feature, idx) => {

        const Icon = feature.icon;

        return (
          <div
            key={idx}
            className="p-8 rounded-xl border border-slate-800 bg-[#020617]/60 hover:bg-[#020617] hover:border-indigo-500/30 transition-all shadow-lg"
          >

            <Icon className="w-10 h-10 text-indigo-400 mb-4" />

            <h3 className="text-xl font-bold text-white mb-2">
              {feature.title}
            </h3>

            <p className="text-gray-400 leading-relaxed">
              {feature.desc}
            </p>

          </div>
        );

      })}

    </div>

  </div>

</section>

      {/* DASHBOARD SNAPSHOT */}
      <section id="snapshot" className="py-24 px-6">

        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Inventory Dashboard
          </h2>

          <p className="text-xl text-gray-400 mb-12">
            Real-time snapshot of warehouse operations
          </p>

          <div className="bg-[#020617]/70 backdrop-blur-md rounded-2xl border border-slate-800 p-16">

            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-6" />

            <h3 className="text-2xl font-bold text-white">
              Dashboard Preview
            </h3>

            <p className="text-gray-400 mt-3">
              Insert your inventory dashboard component here
            </p>

          </div>

        </div>

      </section>

       <section id="comparison" className="py-24 px-6 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Say Goodbye to Manual Inventory
          </h2>

          <p className="text-lg text-slate-400">
            Compare traditional tracking methods with our Inventory Management System
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-[#020617]/70 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden shadow-xl">

          {/* Header */}
          <div className="grid grid-cols-3 border-b border-slate-700 bg-[#020617]">
            <div className="p-6 text-slate-300 font-semibold">Feature</div>
            <div className="p-6 text-center text-slate-400 font-semibold">
              Manual / Excel
            </div>
            <div className="p-6 text-center text-indigo-400 font-semibold">
              InvHub
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 border-b border-slate-800 hover:bg-slate-800/40 transition"
            >
              <div className="p-6 text-white font-medium">
                {row.feature}
              </div>

              <div className="p-6 flex justify-center">
                {row.manual ? (
                  <Check className="text-red-400" />
                ) : (
                  <X className="text-slate-600" />
                )}
              </div>

              <div className="p-6 flex justify-center">
                {row.invhub ? (
                  <Check className="text-green-400" />
                ) : (
                  <X className="text-red-400" />
                )}
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>

      {/* CTA */}
     <section className="py-24 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-center">

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Inventory?
        </h2>

        <p className="text-lg text-indigo-100 mb-8">
          Join businesses streamlining their warehouse operations
        </p>

        <button onClick={() => navigate("/login")} className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg">
          Get Started
        </button>

      </section>

    <footer className="bg-[#020617] border-t border-slate-800 py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">

          {/* Left: Brand Description */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Boxes className="text-indigo-400" size={26} />
              <span className="text-xl font-bold text-white">
                StockPulse
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A modern Inventory Management System designed to help
              businesses replace manual registers and Excel sheets
              with a centralized digital platform.
            </p>
          </div>

          {/* Right: Quick Links */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-white font-semibold mb-4 text-left md:text-right w-full">
              Quick Links
            </h3>
            <ul className="space-y-3 text-slate-400 text-sm text-left md:text-right">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#comparison" className="hover:text-white transition">Comparison</a></li>
              <li><a href="#snapshot" className="hover:text-white transition">Dashboard Preview</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} StockPulse. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>

      </div>
    </footer>

    </div>
  );
}
