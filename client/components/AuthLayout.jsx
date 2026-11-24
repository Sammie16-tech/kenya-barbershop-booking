import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

export default function AuthLayout({
  children,
  image,
  imageAlt,
  title,
  description,
  panelTitle,
  panelDescription,
  switchPrompt,
  switchLabel,
  switchHref,
  panelClassName = 'max-w-md',
  contentClassName = 'items-center'
}) {
  return (
    <div className="grid min-h-screen bg-[#f7f8fb] lg:grid-cols-2">
      <aside className="relative hidden min-h-screen overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/45 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3">
          <img
            src="/images/kenya-barbers-mark.png"
            alt=""
            aria-hidden="true"
            className="h-11 w-11 rounded-2xl bg-white object-contain p-0.5 shadow-lg shadow-blue-950/30"
          />
          <span className="text-lg font-extrabold tracking-tight">Kenya Barbers</span>
        </Link>

        <div className="relative z-10 max-w-xl pb-5">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
            <FaStar className="text-amber-300" aria-hidden="true" />
            Kenya&apos;s grooming community
          </div>
          <h2 className="max-w-lg text-4xl font-black leading-[1.08] tracking-tight xl:text-6xl">
            {panelTitle}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75 xl:text-lg">
            {panelDescription}
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white/80">
            <span className="h-px w-8 bg-blue-400" />
            Great style. Right around the corner.
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-20">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5 lg:invisible">
            <img
              src="/images/kenya-barbers-mark.png"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 rounded-xl bg-white object-contain p-0.5 shadow-sm"
            />
            <span className="font-extrabold tracking-tight text-slate-900">Kenya Barbers</span>
          </Link>
          <p className="ml-auto text-sm text-slate-500">
            {switchPrompt}{' '}
            <Link href={switchHref} className="font-bold text-blue-700 transition hover:text-blue-800">
              {switchLabel}
            </Link>
          </p>
        </header>

        <main className={`flex flex-1 justify-center py-10 ${contentClassName}`}>
          <div className={`w-full ${panelClassName}`}>
            <div className="mb-8">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
                Kenya Barbers
              </p>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                {description}
              </p>
            </div>
            {children}
          </div>
        </main>

        <footer className="pt-2 text-center text-xs text-slate-400">
          Made for better grooming experiences across Kenya.
        </footer>
      </section>
    </div>
  );
}
