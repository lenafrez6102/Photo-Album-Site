"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ForceRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Refresh immediately
    router.refresh();

    // Then refresh quickly a few times to catch Cloudinary propagation
    const timings = [500, 1000, 2000, 4000];
    const timeouts = timings.map((delay) =>
      setTimeout(() => router.refresh(), delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return <></>;
}