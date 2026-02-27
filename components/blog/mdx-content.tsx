"use client";

import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import { InlineCta } from "@/components/blog/inline-cta";

const sharedComponents = {
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      width={800}
      height={450}
      className="rounded-lg"
    />
  ),
  InlineCta,
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={sharedComponents} />;
}
