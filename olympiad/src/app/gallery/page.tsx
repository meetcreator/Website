"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/basePath";

const images = [
  { src: assetPath('/GALLERY/childrenAwards.jpg'), title: "Global Competency Recognition" },
  { src: assetPath('/GALLERY/InviteInterChampionship.jpg'), title: "Inter-School Championship" },
  { src: assetPath('/GALLERY/ChildrenExam.jpg'), title: "Focused Young Learners" },
  { src: assetPath('/GALLERY/childAward.jpg'), title: "Outstanding Achievers" },
  { src: assetPath('/GALLERY/childAward1.jpg'), title: "GCO Future Leaders" },
  { src: assetPath('/GALLERY/childrenAward1.jpg'), title: "GCO Success Stories" },
  { src: assetPath('/GALLERY/ChildAward2.jpg'), title: "Excellence Ceremony" },
  { src: assetPath('/GALLERY/ChildAward3.jpg'), title: "Young GCO Achievers" },
  { src: assetPath('/GALLERY/childrenCongo.jpg'), title: "Celebrating Success" },
  { src: assetPath('/GALLERY/ParentsChildren.jpg'), title: "Proud Moments with Parents" },
  { src: assetPath('/GALLERY/childrenAward.jpg'), title: "National Level Honors" },
  { src: assetPath('/GALLERY/TeenAward.jpg'), title: "Early Learner Excellence" },
  { src: assetPath('/GALLERY/childaward.jpeg'), title: "Competency Award" },
  { src: assetPath('/GALLERY/childaward1.jpeg'), title: "Literacy Excellence" },
  { src: assetPath('/GALLERY/childaward2.jpeg'), title: "Numeracy Hero" },
  { src: assetPath('/GALLERY/childaward3.jpeg'), title: "Science Prodigy" },
  { src: assetPath('/GALLERY/childaward4.jpeg'), title: "School Level Winning" },
  { src: assetPath('/GALLERY/childaward5.jpeg'), title: "Olympiad Brilliance" },
  { src: assetPath('/GALLERY/childaward6.jpeg'), title: "Early Talent Discovery" },
  { src: assetPath('/GALLERY/childaward7.jpeg'), title: "Global Ranking Success" },
  { src: assetPath('/GALLERY/childaward8.jpeg'), title: "Merit Certificate" },
  { src: assetPath('/GALLERY/childaward9.jpeg'), title: "Top Score Achievement" },
  { src: assetPath('/GALLERY/childaward10.jpeg'), title: "GCO Proud Moment" },
  { src: assetPath('/GALLERY/childrenawards.jpeg'), title: "United in Excellence" },
  { src: assetPath('/GALLERY/childrenawards1.jpeg'), title: "GCO Highlights" },
  { src: assetPath('/GALLERY/childrenawards2.jpeg'), title: "International Standards" },
  { src: assetPath('/GALLERY/childrenawards3.jpeg'), title: "GCO Night of Awards" },
  { src: assetPath('/GALLERY/childrenawards4.jpeg'), title: "Victory Moments" },
  { src: assetPath('/GALLERY/childrenawards5.jpeg'), title: "GCO Medalists" },
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
            className="text-5xl md:text-7xl font-black text-[#002d5b] mb-4 italic uppercase tracking-tighter"
          >
            Moments <span className="text-[#2da3c2]">Of Excellence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-sm font-black uppercase tracking-widest"
          >
            Celebrating the journey of young learners excelling in the Global Competency Olympiad.
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
                className="relative group rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all break-inside-avoid bg-white p-3"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-auto rounded-[2rem] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002d5b]/90 via-[#002d5b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 pointer-events-none rounded-[2.5rem]">
                  <h4 className="text-white font-black text-xs uppercase tracking-widest leading-none drop-shadow-md">{image.title}</h4>
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
