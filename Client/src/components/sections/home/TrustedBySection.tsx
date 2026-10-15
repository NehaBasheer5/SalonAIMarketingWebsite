import Image from 'next/image';
import { images } from '@/assets';

export default function TrustedBySection() {
  return (
    <section className="w-full bg-salon-bg pt-2 pb-0">
      <div className="max-w-7xl mx-auto px-6 text-center lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        {/* Section Headline */}
        <h2 className="mb-2 font-display text-3xl leading-tight tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
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