import heroBanner from "@/assets/hero-banner.jpg";

export function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      <div className="aspect-[3/1] w-full">
        <img
          src={heroBanner}
          alt="Serene landscape with rolling hills and wildflowers"
          className="h-full w-full object-cover"
          width={1920}
          height={640}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          Story Calendar
        </h1>
        <p className="mt-1 max-w-md text-sm text-primary-foreground/80 md:text-base">
          Capture moments, plan ahead, and tell your story — one day at a time.
        </p>
      </div>
    </div>
  );
}
