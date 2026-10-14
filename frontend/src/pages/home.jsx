import React from 'react'
import Nav from '../components/nav'
import YumzoChatbot from '../components/chatBot';
import FoodItems from '../components/FoodItems';
import { useSelector } from 'react-redux';
import { FiClock, FiMapPin, FiStar, FiTrendingUp } from 'react-icons/fi';

function Home() {
  const { userData } = useSelector(state => state.user)

  return (
    <div className="min-h-screen bg-[#fffaf6] text-slate-900">
      <Nav />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-red-500 via-red-600 to-rose-500 p-6 shadow-[0_25px_60px_rgba(220,38,38,0.22)] sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,228,230,0.22),transparent_25%)]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-red-50 backdrop-blur-sm">
                <FiTrendingUp size={12} /> Fresh cravings, faster
              </div>
              <h1 className="max-w-xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                Feast on the good stuff.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-red-50/90 sm:text-base">
                Discover chef-loved bites, comfort classics, and late-night favorites delivered to your doorstep with a premium food experience.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-lg shadow-red-900/10 transition hover:scale-[1.02]">
                  Explore menu
                </button>
                <button className="rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">
                  Order now
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xs">
              <div className="rounded-[30px] border border-white/30 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <div className="rounded-[24px] bg-[#fff7ed] p-4 text-slate-900 shadow-inner">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-orange-500">Today</p>
                      <h3 className="mt-1 text-xl font-bold">Chef special</h3>
                    </div>
                    <div className="rounded-full bg-red-100 p-2 text-red-500">
                      <FiStar size={18} />
                    </div>
                  </div>

                  <div className="rounded-[20px] bg-gradient-to-br from-orange-100 to-amber-50 p-3">
                    <div className="mb-3 h-28 rounded-[16px] bg-[linear-gradient(135deg,#fdba74,#f97316,#f59e0b)] shadow-inner" />
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Fire pizza combo</p>
                        <p className="mt-1 text-xs text-slate-500">2 items • 20 mins</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">₹449</p>
                        <p className="text-[10px] text-emerald-600">Free delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Fast delivery', value: '15-25 min', icon: FiClock },
            { label: 'Your city', value: userData?.user?.city || 'Downtown', icon: FiMapPin },
            { label: 'Top rated', value: '4.8/5 foodies', icon: FiStar }
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 inline-flex rounded-xl bg-red-100 p-2 text-red-600">
                <Icon size={18} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">Curated for you</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-900">Popular picks</h2>
            </div>
            <button className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm sm:block">View all</button>
          </div>
          <FoodItems />
        </section>
      </main>

      <aside className="fixed bottom-6 right-6 z-50">
        <YumzoChatbot />
      </aside>
    </div>
  );
};

export default Home