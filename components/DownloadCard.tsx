import type { JSX } from "react";

export default function Page({
  params,
}: {
  params: { slug: string };
}): JSX.Element {
  return (
    <div>
      <h1>Slug: {params.slug}</h1>
    </div>
  );
}
