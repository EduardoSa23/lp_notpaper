"use client";

import { useMemo } from "react";
import Image from "next/image";

export default function LogosRow({ logos }) {
  const repeated = useMemo(() => Array.from({ length: 5 }, () => logos).flat(), [logos]);

  return (
    <div className="logo-row">
      <div className="logo-slider">
        {repeated.map((logo, index) => (
          <div key={`${logo.alt}-${index}`} className="flex items-center justify-center px-6">
            <Image
              src={logo.img}
              alt={logo.alt}
              width={160}
              height={160}
              className="max-h-16 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
