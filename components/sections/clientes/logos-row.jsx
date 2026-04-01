"use client";

import { useMemo } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

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
              width={120}
              height={100}
              className="max-w-[120px] object-contain grayscale transition duration-300 hover:grayscale-0"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{ height: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
