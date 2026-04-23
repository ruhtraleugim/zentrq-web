import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="border-b border-surface-secondary bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-xl font-semibold text-brand-base tracking-tight">ZentrQ</span>
          <Link
            href="/login"
            className="rounded-lg border border-brand-base px-4 py-2 text-sm font-medium text-brand-base hover:bg-brand-base hover:text-white transition-colors"
          >
            Entrar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold text-text-dark leading-tight sm:text-5xl">
          Controle, segurança e execução<br />
          <span className="text-brand-base">sem depender de indicação.</span>
        </h1>
        <p className="mt-6 text-lg text-text-mid">
          Conectamos clientes a profissionais da construção civil de forma confiável e transparente.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register?role=CLIENTE"
            className="rounded-lg bg-brand-base px-6 py-3 text-sm font-medium text-white hover:bg-brand-support transition-colors"
          >
            Sou Cliente
          </Link>
          <Link
            href="/register?role=PROFISSIONAL"
            className="rounded-lg border border-brand-base px-6 py-3 text-sm font-medium text-brand-base hover:bg-brand-base hover:text-white transition-colors"
          >
            Sou Profissional
          </Link>
        </div>

        {/* Prova social */}
        <div className="mt-12 flex justify-center gap-10 text-sm text-text-mid">
          <div><span className="block text-2xl font-semibold text-text-dark">+1.200</span>serviços realizados</div>
          <div><span className="block text-2xl font-semibold text-text-dark">+350</span>profissionais</div>
          <div><span className="block text-2xl font-semibold text-text-dark">+40</span>cidades</div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-center text-2xl font-semibold text-text-dark">Como funciona</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: '1', title: 'Publique o serviço', desc: 'Descreva o que precisa e onde — em menos de 2 minutos.' },
              { n: '2', title: 'Receba propostas', desc: 'Profissionais qualificados enviam preço e prazo. Você escolhe.' },
              { n: '3', title: 'Acompanhe e pague', desc: 'Pagamento seguro só após confirmar a conclusão do serviço.' },
            ].map(step => (
              <div key={step.n} className="rounded-xl border border-surface-secondary p-6">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-base text-sm font-semibold text-white">
                  {step.n}
                </div>
                <h3 className="font-semibold text-text-dark">{step.title}</h3>
                <p className="mt-1 text-sm text-text-mid">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
