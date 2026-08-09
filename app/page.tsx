import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050a06] text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-green-600/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-green-800/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">

          {/* Giant W Logo */}
          <div className="mb-12 flex justify-center animate-float">
            <svg
              viewBox="0 0 400 200"
              className="w-48 md:w-64 lg:w-80 w-logo-pulse"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* W shape with gradient */}
              <defs>
                <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M20 30 L80 170 L140 80 L200 150 L260 80 L320 170 L380 30"
                stroke="url(#wGrad)"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            </svg>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-shimmer-green leading-tight">
            Wata Pro
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Корпоратив 2025 — финтех, который меняет правила игры.
          </p>
          <p className="text-lg text-green-400/80 max-w-2xl mx-auto leading-relaxed mb-12">
            Технологии. Инновации. Команда. Присоединяйтесь к нам в ночь, когда код превращается в праздник.
          </p>

          {/* Scroll indicator */}
          <div className="animate-bounce mt-12">
            <svg className="w-8 h-8 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Image Block 1 — Команда */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-800/5 rounded-3xl" />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-green-400 via-white to-green-300 bg-clip-text text-transparent">
              Наша команда
            </span>
          </h2>
          <div className="rounded-2xl overflow-hidden border-2 border-green-500/30 bg-gradient-to-br from-green-950/40 to-gray-900 p-2 animate-glow-pulse">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center group">
              {/* ВСТАВЬТЕ КАРТИНКУ: команда.jpg */}
              <img
                src=""
                alt="Команда Wata Pro — фото команды на корпоративе"
                className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <svg className="w-16 h-16 mb-4 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg font-medium">Вставьте: команда.jpg</span>
                <span className="text-sm mt-2 text-gray-600">Фото команды Wata Pro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
            Wata Pro в цифрах
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-gray-900/80 to-green-950/30 border border-green-500/20 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-green-500/20">
              📊
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">₽10B+</div>
            <p className="text-gray-400">Объём транзакций в день</p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-gray-900/80 to-green-950/30 border border-green-500/20 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-green-500/20">
              👥
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
            <p className="text-gray-400">Сотрудников в команде</p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-gray-900/80 to-green-950/30 border border-green-500/20 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-green-500/20">
              🚀
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">1M+</div>
            <p className="text-gray-400">Активных пользователей</p>
          </div>
        </div>
      </section>

      {/* Image Block 2 — Офис / Технологии */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-green-300 via-white to-green-400 bg-clip-text text-transparent">
            Наши технологии
          </span>
        </h2>
        <div className="rounded-2xl overflow-hidden border-2 border-green-500/30 bg-gradient-to-br from-green-950/40 to-gray-900 p-2 animate-glow-pulse" style={{ animationDelay: '1s' }}>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center group">
            {/* ВСТАВЬТЕ КАРТИНКУ: технологии.jpg */}
            <img
              src=""
              alt="Технологии Wata Pro — платформа и инфраструктура"
              className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <svg className="w-16 h-16 mb-4 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-medium">Вставьте: технологии.jpg</span>
              <span className="text-sm mt-2 text-gray-600">Платформа и инфраструктура Wata Pro</span>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <span className="bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent">
            Что ждёт вас на корпоративе
          </span>
        </h2>
        <div className="space-y-6">
          {[
            {
              step: "1",
              title: "Welcome & Networking",
              desc: "Встреча коллег из разных отделов. Знакомства, обмен идеями и неформальное общение за напитками.",
              emoji: "🍸",
            },
            {
              step: "2",
              title: "Live Demo — Новые продукты",
              desc: "Презентация новинок от продуктовых команд. Увидьте будущее финтеха своими глазами.",
              emoji: "💡",
            },
            {
              step: "3",
              title: "Хакатон-баттл",
              desc: "Команды соревнуются в создании прототипов за 2 часа. Призы, аплодисменты и хайп.",
              emoji: "⚡",
            },
            {
              step: "4",
              title: "Вечеринка & Награждения",
              desc: "DJ, танцы, награждение лучших сотрудников года и незабываемая атмосфера праздника.",
              emoji: "🎉",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-6 bg-gradient-to-r from-gray-900/80 to-green-950/20 border border-green-500/10 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-2xl font-bold shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
                  {item.emoji}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-400 text-sm font-bold uppercase tracking-wider">Этап {item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Block 3 — Место проведения */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-green-400 via-white to-green-300 bg-clip-text text-transparent">
            Место проведения
          </span>
        </h2>
        <div className="rounded-2xl overflow-hidden border-2 border-green-500/30 bg-gradient-to-br from-green-950/40 to-gray-900 p-2 animate-glow-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center group">
            {/* ВСТАВЬТЕ КАРТИНКУ: место_проведения.jpg */}
            <img
              src=""
              alt="Место проведения корпоратива Wata Pro"
              className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <svg className="w-16 h-16 mb-4 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-medium">Вставьте: место_проведения.jpg</span>
              <span className="text-sm mt-2 text-gray-600">Локация корпоратива</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Game */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent rounded-3xl" />
        <div className="relative">
          <div className="text-5xl mb-6 animate-float">🏗️</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Готовы к вызову?
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Проверьте свою ловкость в игре Tower Stack! Стройте башню как слои кода — аккуратно и точно.
          </p>
          <Link href="/tower-game" className="inline-block">
            <span className="group relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 rounded-full text-xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl shadow-green-500/30 hover:shadow-green-500/50">
              <span>Играть в Tower Stack</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 to-transparent" />
        <div className="relative">
          {/* Small W logo in footer */}
          <svg viewBox="0 0 400 200" className="w-16 mx-auto mb-4 opacity-40" fill="none">
            <path
              d="M20 30 L80 170 L140 80 L200 150 L260 80 L320 170 L380 30"
              stroke="#22c55e"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-gray-600 mb-2">© 2025 Wata Pro — Корпоратив</p>
          <p className="text-gray-700 text-sm">Сделано с 💚 для команды</p>
        </div>
      </footer>
    </div>
  );
}
