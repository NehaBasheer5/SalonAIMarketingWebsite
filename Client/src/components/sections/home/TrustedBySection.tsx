import Image from 'next/image';
import { images } from '@/assets';

export default function TrustedBySection() {
  return (
    <section className="w-full bg-white pt-2 pb-0">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Headline */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          Trusted by 10,000+ Salons Worldwide
        </h2>

        {/* Client Logos Banner Container */}
        <div className="flex justify-center items-center max-w-5xl mx-auto">
          <Image
            src={images.salonLogos}
            alt="Trusted client salons including Looks, Naturals, Geetanjali, Lakme, Juice, and Green Trends"
            width={1100}
            height={120}
            className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            priority
          />
        </div>
      </div>
    </section>
  );
}