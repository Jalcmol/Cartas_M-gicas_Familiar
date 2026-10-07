import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, CheckCircle, ArrowRight, Star, Clock, Users, Gift, HelpCircle } from 'lucide-react';
import { CHARACTERS } from '../data/characters';

interface LandingViewProps {
  onGoToApp: () => void;
  onOpenArchitecture: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onGoToApp, onOpenArchitecture }) => {
  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge de confianza */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>La tradición más bonita de la infancia en España</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight font-['Cinzel_Decorative','Cinzel',serif] leading-tight">
            Cartas que hacen brillar sus ojos de emoción
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-['Cormorant_Garamond',serif] text-xl">
            Crea cartas oficiales de los <strong className="text-stone-900">Reyes Magos, Papá Noel y el Ratoncito Pérez</strong> con sellos de lacre, matasellos reales y detalles que solo ellos saben.
          </p>

          {/* Valor cero timo destacado */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs sm:text-sm text-stone-800 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-amber-950 font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>Pack Familiar "Cero Timo":</span>
            </div>
            <span className="text-stone-700">
              Solo <strong className="text-amber-900 text-base">4,99 €</strong> por 10 cartas descargables · Sin caducidad · Hasta 6 niños incluidos
            </span>
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToApp}
              className="w-full sm:w-auto px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Personalizar y Ver Carta Gratis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onOpenArchitecture}
              className="w-full sm:w-auto px-5 py-4 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Ver Arquitectura Vercel + Upstash
            </button>
          </div>

          <p className="text-xs text-stone-500">
            Pruébalo 100% gratis en tiempo real · Solo pagas cuando decides descargar el PDF oficial limpio
          </p>
        </div>
      </section>

      {/* MUESTRARIO DE PERSONAJES (8 PERSONAJES) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-['Cinzel',serif]">
            8 Personajes Mágicos a Tu Elección
          </h2>
          <p className="text-sm text-stone-600">
            Desde la Noche de Reyes hasta el Ratoncito Pérez a lo largo de todo el año.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{char.emblem}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {char.badge}
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-base font-['Cinzel',serif]">
                  {char.name}
                </h3>
                <p className="text-xs text-amber-900 font-medium mt-0.5 mb-2">{char.shortTitle}</p>
                <p className="text-xs text-stone-600 leading-relaxed">{char.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Sello: {char.sealLabel}</span>
                <button
                  onClick={onGoToApp}
                  className="text-amber-800 font-semibold hover:underline"
                >
                  Elegir →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARATIVA "CERO TIMO" */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-10 border border-stone-800 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              Honestidad Para Familias
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
              ¿Por qué Cartas Mágicas es diferente?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Nacimos cansados de plataformas que cobran 8 € por una sola carta o que te borran la cuenta el 7 de enero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-4">
              <h3 className="font-bold text-red-400 text-sm uppercase tracking-wider">
                Otras Webs Habituales
              </h3>
              <ul className="text-xs text-stone-400 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Te cobran entre 7 € y 12 € por una sola carta de un solo niño.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>El acceso caduca a los 5 días de Reyes; si tienes otro hijo o cae un diente, debes pagar de nuevo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>No puedes ver el resultado exacto hasta que pasas por caja.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-amber-950/40 border border-amber-600/40 space-y-4">
              <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Cartas Mágicas (Pack Familiar)
              </h3>
              <ul className="text-xs text-stone-200 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1 único pago de 4,99 €</strong> con saldo de 10 descargas oficiales de alta calidad.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sin caducidades crueles:</strong> Tu saldo sirve para Reyes, Papá Noel y el Ratoncito Pérez todo el año.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Hasta 6 niños incluidos</strong> en tu pack familiar con tolerancia a corrección de erratas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Vista previa gratuita completa:</strong> Diseña, retoca y lee la carta antes de poner un solo euro.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS DE FAMILIAS EN ESPAÑA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-['Cinzel',serif]">
            Opiniones de Familias Reales
          </h2>
          <p className="text-sm text-stone-600">
            Miles de niños en Madrid, Sevilla, Valencia y toda España ya han sentido la magia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Laura M. (Madrid)',
              text: 'A mis gemelos se les iluminó la cara cuando vieron que los Reyes Magos mencionaban sus clases de judo y el tren de madera. La calidad de la impresión A4 parece sacada de un museo.',
              badge: 'Mamá de Mateo y Lucas (6 años)',
            },
            {
              name: 'Javier R. (Sevilla)',
              text: 'Lo mejor es que compré el pack en Navidad y este mes a mi hija pequeña se le cayó su primer diente. Pude usar el saldo para la carta del Ratoncito Pérez sin pagar nada más. Eso es honestidad.',
              badge: 'Papá de Carmen (7 años)',
            },
            {
              name: 'Elena S. (Valencia)',
              text: 'Poder personalizar la carta y verla gratis antes de pagar te da una tranquilidad absoluta. La descargamos en PDF y la imprimimos en papel verjurado. ¡Quedó espectacular!',
              badge: 'Mamá de Sofía (4 años)',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex text-amber-500 gap-1 text-sm">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                "{item.text}"
              </p>
              <div className="pt-2 border-t border-stone-100">
                <div className="font-bold text-xs text-stone-900">{item.name}</div>
                <div className="text-[11px] text-stone-500">{item.badge}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl font-bold text-stone-900 font-['Cinzel',serif]">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              q: '¿Cómo recibo las cartas limpias sin marca de agua?',
              a: 'Tras personalizar la carta a tu gusto, pulsas en "Descargar PDF Limpio Oficial". El sistema genera un archivo A4 de alta definición (300 DPI) con tipografías vectoriales, listo para guardar en PDF o imprimir en casa o en copistería.',
            },
            {
              q: '¿Qué pasa si me equivoco en una letra del nombre de mi hijo?',
              a: 'Nuestra protección inteligente detecta erratas leves (por ejemplo, "Lucia" vs "Lucía") y permite hasta 2 modificaciones gratuitas para que nunca te quedes sin tu carta correcta.',
            },
            {
              q: '¿Puedo usarlo para varios hermanos o primos?',
              a: '¡Sí! Puedes vincular hasta 6 niños distintos en tu pack de 10 cartas sin ningún coste adicional.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-1">{faq.q}</h4>
              <p className="text-stone-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
