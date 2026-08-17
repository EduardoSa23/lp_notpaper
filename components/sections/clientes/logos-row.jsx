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
          <div
            key={`${logo.alt}-${index}`}
            className="group flex w-[160px] shrink-0 flex-col items-center justify-start gap-3 px-6"
          >
            <div className="flex h-[80px] items-center justify-center">
              <Image
                src={logo.img}
                alt={logo.alt}
                width={120}
                height={100}
                className="max-h-[80px] w-auto max-w-[120px] object-contain grayscale transition duration-300 group-hover:grayscale-0"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                style={{ height: "auto" }}
              />
            </div>
            <span className="whitespace-normal text-center text-xs font-medium leading-tight text-gray-600">
              {logo.nome ?? logo.alt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
