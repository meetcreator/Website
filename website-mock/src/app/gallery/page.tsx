"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const images = [
  { src: "/GALLERY/childrenAwards.jpg", title: "Global Recognition" },
  { src: "/GALLERY/ChildrenExam.jpg", title: "Concentration & Focus" },
  { src: "/GALLERY/childAward.jpg", title: "Top Performers" },
  { src: "/GALLERY/childAward1.jpg", title: "Future Leaders" },
  { src: "/GALLERY/childrenAward.jpg", title: "International Honors" },
  { src: "/GALLERY/childrenAward1.jpg", title: "Success Stories" },
  { src: "/GALLERY/ChildAward2.jpg", title: "Award Ceremony" },
  { src: "/GALLERY/ChildAward3.jpg", title: "Young Achievers" },
  { src: "/GALLERY/childrenCongo.jpg", title: "Congratulations" },
  { src: "/GALLERY/InviteInterChampionship.jpg", title: "Championship Invite" },
  { src: "/GALLERY/ParentsChildren.jpg", title: "Parental Pride" },
  { src: "/GALLERY/TeenAward.jpg", title: "Teen Excellence" },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Gallery Hero */}
      <section className="pt-48 pb-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-[#002d5b] mb-4"
          >
            Achievements <span className="text-[#2da3c2]">&</span> Moments
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg"
          >
            A visual journey through our global competitions, award ceremonies, 
            and the brilliant students who make it all happen.
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all break-inside-avoid bg-white p-2"
              >
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-auto rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002d5b]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 pointer-events-none">
                  <h4 className="text-white font-bold text-lg">{image.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
