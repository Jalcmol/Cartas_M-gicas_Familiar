export interface CharacterTextConfig {
  greeting: (name: string) => string;
  p1: (data: { name: string; city: string; achievement: string }) => string;
  p2: (data: { behavior: string }) => string;
  giftParagraph: (gift: string) => string;
  defaultAdvice: string;
  finalMessage: (name: string) => string;
  valediction: string;
  signature: string;
  sealLabel: string;
  sealIcon: string;
  funBadge: {
    title: string;
    subtitle: string;
    icon: string;
    color: string;
  };
  stickers: Array<{ emoji: string; text: string; bg: string }>;
  particleType: 'gold_stars' | 'snowflakes' | 'mouse_cheese' | 'fairy_dust' | 'elf_bells';
}

export const CHARACTER_SCRIPTS: Record<string, CharacterTextConfig> = {
  reyes_magos: {
    greeting: (name) => `¡Hola, queridísimo/a y súper campeón/a ${name || 'pequeño/a'}! 👑✨`,
    p1: ({ name, city, achievement }) =>
      `¡Qué alegría tan grande nos da escribirte! Aquí en nuestro Palacio de Oriente, Melchor, Gaspar y Baltasar acabamos de mirar por nuestro telescopio de oro hacia ${city || 'tu casita'}. ¡Y te hemos visto sonreír! Los pajes reales nos han contado que este año te has esforzado muchísimo en ${achievement || 'aprender un montón de cosas nuevas y divertidas'}. ¡Melchor casi se cae de la silla de la emoción y Gaspar no paraba de aplaudir! 👏🐪`,
    p2: ({ behavior }) =>
      `En el Gran Libro Secreto de Oriente, donde guardamos las sonrisas más bonitas del planeta, tu nombre está rodeado de purpurina dorada. Nos encanta cuando eres tan cariñoso/a y te portas genial al ${behavior || 'ayudar en casa y regalar abrazos de oso a tu familia'}. ¡Ese es el mejor superpoder del mundo! 🌟`,
    giftParagraph: (gift) =>
      `¡Ah! Y sobre "${gift}": Melchor ya ha estado empaquetándolo con papel de estrellas y Gaspar le ha puesto un lazo enorme. ¡Nuestros camellos ya están afinando sus patitas para llegar rapidísimo! 🎁✨`,
    defaultAdvice:
      `Recuerda acostarte tempranito la noche del 5 de enero, cerrar fuerte los ojitos y dejar algo de agua y mandarinas para los camellos, ¡que terminan con la lengua fuera de tanto correr! 🍊🐪`,
    finalMessage: (name) =>
      `Te queremos con locura, ${name || 'pequeño gran tesoro'}. Sigue riendo y soñando a lo grande. ¡Esta noche la estrella más brillante del cielo te guiña un ojo solo a ti! ⭐`,
    valediction: 'Con un millón de abrazos reales y lluvia de estrellas,',
    signature: 'Melchor, Gaspar y Baltasar 👑👑👑',
    sealLabel: 'REYES MAGOS',
    sealIcon: '⭐',
    funBadge: {
      title: 'DIPLOMA REAL OFICIAL',
      subtitle: 'Certificado de Niño/a Súper Especial',
      icon: '👑',
      color: 'amber',
    },
    stickers: [
      { emoji: '🐪', text: 'Camello Real Aprobado', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
      { emoji: '⭐', text: '100% Magia de Oriente', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
      { emoji: '🎁', text: 'Superregalos Listos', bg: 'bg-red-100 text-red-900 border-red-300' },
    ],
    particleType: 'gold_stars',
  },

  melchor: {
    greeting: (name) => `¡Hola, mi querido/a y travieso/a ${name || 'amiguito/a'}! 👑✨`,
    p1: ({ city, achievement }) =>
      `¡Soy el Rey Melchor! Te escribo con mi pluma de oro mientras me acaricio mi gran barba blanca (que a veces los pajes confunden con una nube de algodón dulce ☁️). Desde mi torre más alta he estado vigilando ${city || 'tu ciudad'} y me he enterado de que has logrado ${achievement || 'cosas increíbles en el cole y en casa'}. ¡Se me han saltado lágrimas de alegría en la barba!`,
    p2: ({ behavior }) =>
      `Tengo anotado en mi pergamino real lo súper bueno/a que has sido al ${behavior || 'repartir sonrisas y cuidar tanto a quienes te rodean'}. ¡Eso vale más que todo el oro que llevo en mi cofre real! 💛`,
    giftParagraph: (gift) =>
      `He visto con cuánto cariño pedías "${gift}". ¡He puesto una etiqueta con tu nombre en letras doradas gigantes para que no se me olvide en el saco! 📦`,
    defaultAdvice:
      `Sigue siendo tan bondadoso/a y alegre. Y por favor, déjame unas galletitas cerca del árbol, ¡que a mi camello le encanta el dulce! 🍪🐪`,
    finalMessage: (name) =>
      `¡Un abrazo gigante como una montaña de arena, mi querido/a ${name || 'pequeño/a'}! ¡Nos vemos muy pronto por tu salón!`,
    valediction: 'Tu amigo de barba blanca que te quiere un montón,',
    signature: 'Rey Melchor 👑',
    sealLabel: 'REY MELCHOR',
    sealIcon: '☀️',
    funBadge: {
      title: 'ORDEN DEL ORO REAL',
      subtitle: 'Premio al Gran Esfuerzo y Bondad',
      icon: '☀️',
      color: 'amber',
    },
    stickers: [
      { emoji: '✨', text: 'Oro Sagrado', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
      { emoji: '🍪', text: 'Amigo de Melchor', bg: 'bg-orange-100 text-orange-900 border-orange-300' },
    ],
    particleType: 'gold_stars',
  },

  gaspar: {
    greeting: (name) => `¡Hola, valiente y genial ${name || 'campeón/a'}! 👑🌟`,
    p1: ({ city, achievement }) =>
      `¡Soy Gaspar! Sí, el rey de la barba castaña y el más saltarín de los tres. Mi camello acaba de tropezar de la emoción porque le he leído en voz alta que tú, desde ${city || 'tu hogar'}, has conseguido ${achievement || 'aprender tanto y demostrar que eres un/a auténtico/a campeón/a'}. ¡Hemos dado tres saltos de alegría! 🐪💨`,
    p2: ({ behavior }) =>
      `Me encanta ver que tienes un corazón tan grande y que te gusta ${behavior || 'hacer reír a los demás y ayudar cuando hace falta'}. En Oriente tenemos fuegos artificiales de colores cada vez que un niño hace algo tan bonito como tú. 🎆`,
    giftParagraph: (gift) =>
      `¡Vaya regalo chulo nos has pedido con "${gift}"! Lo tengo bien guardadito en la alforja principal de mi camello, listo para la gran noche. 🎁✨`,
    defaultAdvice:
      `¡No te olvides de lavarte los dientes y meterte en la cama bien tapadito/a! Si oyes cascabeles en el tejado... ¡somos nosotros aterrizando! 🔔`,
    finalMessage: (name) =>
      `¡Choca esos cinco mágicos desde Oriente, ${name || 'súper héroe'}! ¡Sigue siendo tan divertido/a!`,
    valediction: 'Con risas, confeti de estrellas y mi mejor abrazo,',
    signature: 'Rey Gaspar 👑',
    sealLabel: 'REY GASPAR',
    sealIcon: '✨',
    funBadge: {
      title: 'ESTRELLA GUÍA REAL',
      subtitle: 'Corazón Valiente y Alegre',
      icon: '✨',
      color: 'yellow',
    },
    stickers: [
      { emoji: '🐪', text: 'Paso Veloz', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
      { emoji: '🎆', text: 'Alegría 100%', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    ],
    particleType: 'gold_stars',
  },

  baltasar: {
    greeting: (name) => `¡¡Holaaa, mi gran sol y alegría ${name || 'pequeño/a'}!! 👑🎈`,
    p1: ({ city, achievement }) =>
      `¡Soy Baltasar! ¡Tu rey favorito! Te mando este mensaje con un baile de tambores y alegría desde las dunas más mágicas. ¿Sabes qué? Mi elefante gigante y juguetón acaba de enterarse de que en ${city || 'tu casa'} has logrado ${achievement || 'superarte cada día con una sonrisa gigante'} ¡y ha empezado a tirar agua de colores con la trompa de lo contento que está! 🐘💦🎉`,
    p2: ({ behavior }) =>
      `Eres un/a niño/a extraordinario/a. Cuando te portas tan bien al ${behavior || 'dar mimos a tu familia y ser tan buen compañero/a'}, haces que el mundo entero sea un lugar más brillante y divertido. ¡Me dan ganas de darte un achuchón de oso polar! 🐻❤️`,
    giftParagraph: (gift) =>
      `¡Tengo tu regalo "${gift}" en mi cofre más brillante! Baltasar nunca falla. Va a ser una sorpresa súper emocionante cuando despiertes. 🎁🎊`,
    defaultAdvice:
      `Duérmete pronto, cierra los ojitos y sueña con volar entre las estrellas. ¡Prometo no hacer ruido al entrar, aunque mis babuchas a veces chirrían un poquito! 🤫👞`,
    finalMessage: (name) =>
      `¡Eres la alegría de Oriente, querido/a ${name || 'tesoro'}! ¡Sigue bailando, jugando y comiéndote el mundo con patatas!`,
    valediction: 'Con el abrazo más grandote del universo entero,',
    signature: 'Tu Rey Baltasar 👑🐘',
    sealLabel: 'REY BALTASAR',
    sealIcon: '🌟',
    funBadge: {
      title: 'REY DE LAS SONRISAS',
      subtitle: 'Abrazo de Oro y Tambores de Alegría',
      icon: '🌟',
      color: 'amber',
    },
    stickers: [
      { emoji: '🐘', text: 'Elefante Real', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
      { emoji: '🎉', text: 'Fiesta Real', bg: 'bg-rose-100 text-rose-900 border-rose-300' },
    ],
    particleType: 'gold_stars',
  },

  papa_noel: {
    greeting: (name) => `¡¡Ho, ho, hooooo!! ¡¡Hola, mi querido/a ${name || 'pequeño/a duendecillo/a'}!! 🎅❄️`,
    p1: ({ city, achievement }) =>
      `¡Ho, ho, ho! Te escribo desde mi cabaña de madera en Rovaniemi, junto a la chimenea y rodeado de galletitas recién horneadas. El reno Rudolph tiene la nariz tan roja y brillante de emoción porque los elfos le han soplado que tú en ${city || 'tu pueblo/ciudad'} has conseguido ${achievement || 'aprender cosas increíbles y crecer tan bien este año'}. ¡Los duendes han montado una fiesta tirando bolas de nieve! ⛄❄️`,
    p2: ({ behavior }) =>
      `En mi Lista Secreta del Polo Norte tienes una estrella verde gigante al lado de tu nombre por ${behavior || 'ser tan cariñoso/a, ayudar tanto y regalar abrazos calentitos'}. La señora Claus dice que niños tan maravillosos como tú son los que hacen que la Navidad sea mágica de verdad. 💖🎄`,
    giftParagraph: (gift) =>
      `¡Sobre tu petición de "${gift}": los elfos carpinteros y jugueteros le han dado los últimos toques mágicos y ya está en el trineo bien abrigadito bajo una manta de renos! 🛷🎁`,
    defaultAdvice:
      `La noche de Nochebuena vete a dormir prontito. Si dejas un vasito de leche con canela para mí y dos zanahorias para Rudolph, ¡te prometo que se pondrá a dar saltos por el tejado! 🥛🥕🦌`,
    finalMessage: (name) =>
      `¡Nunca dejes de sonreír, mi valiente ${name || 'amigo/a'}! ¡Que la magia de la nieve y los cascabeles llene tu casita de risas!`,
    valediction: '¡Ho, ho, ho! Con todo mi amor navideño y un cascabel de la suerte,',
    signature: 'Papá Noel / Santa Claus 🎅❄️',
    sealLabel: 'POLO NORTE',
    sealIcon: '🦌',
    funBadge: {
      title: 'LISTA DE BUENOS OFICIAL',
      subtitle: 'Certificado Polar de Primera Categoría',
      icon: '❄️',
      color: 'rose',
    },
    stickers: [
      { emoji: '🦌', text: 'Rudolph Aprobó', bg: 'bg-red-100 text-red-900 border-red-300' },
      { emoji: '🛷', text: 'Trineo en Ruta', bg: 'bg-sky-100 text-sky-900 border-sky-300' },
      { emoji: '🎄', text: 'Espíritu Navideño', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    ],
    particleType: 'snowflakes',
  },

  ratoncito_perez: {
    greeting: (name) => `¡Chist! ¡Hola, mi campeón/a ${name || 'amigo/a'}! (Te escribo bajito para no despertar a nadie 🤫🐭🧀)`,
    p1: ({ city, achievement }) =>
      `¡Soy el Ratoncito Pérez! Te escribo con mi pluma diminuta desde mi casita secreta dentro de una caja de galletas en la Calle del Arenal Nº 8 en Madrid. ¡Mis bigotes empezaron a vibrar como antenas de radio cuando me avisaron de que en ${city || 'tu casa'} has logrado ${achievement || 'ser súper valiente y cepillarte genial los dientes'}! He tenido que ponerme mis gafas redonditas de joyero para admirar lo bien que lo has hecho. 👓🐭✨`,
    p2: ({ behavior }) =>
      `En mi fábrica secreta de dientes convertimos los dientecitos limpios y fuertes en estrellas brillantes para el cielo nocturno. ¡Y sé que eres un/a niño/a estupendo/a porque siempre te esfuerzas por ${behavior || 'portarte con tanta generosidad y alegría en casa'}! Por eso te has ganado una medalla ratonil de primera clase. 🏅`,
    giftParagraph: (gift) =>
      `He preparado para ti una sorpresa mágica especial: "${gift}". La llevo en mi mochilita de cuero junto a mi queso curado favorito. ¡Pesa un poquito pero mis patitas son muy veloces! 🎒🪙`,
    defaultAdvice:
      `Coloca tu diente bien limpito bajo la almohada antes de dormir. Yo entraré con mis zapatillitas de terciopelo verde que no hacen ni un solo "ñic-ñic" para no despertar ni al gato de los vecinos. 🐱💤`,
    finalMessage: (name) =>
      `¡Sigue cuidando esa sonrisa tan bonita y brillante, ${name || 'mi ratoncillo/a favorito/a'}! ¡Nos vemos bajo la almohada!`,
    valediction: 'Un abrazo suave, una caricia de bigotes y un crujiente trocito de queso,',
    signature: 'Ratoncito Pérez 🐭🧀',
    sealLabel: 'RATÓN PÉREZ',
    sealIcon: '🦷',
    funBadge: {
      title: 'CLUB DEL DIENTE BRILLANTE',
      subtitle: 'Inspector Honorífico de Sonrisas Sanas',
      icon: '🧀',
      color: 'amber',
    },
    stickers: [
      { emoji: '🦷', text: 'Diente de Oro', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
      { emoji: '🧀', text: 'Queso Reserva Real', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
      { emoji: '🎒', text: 'Entrega Silenciosa', bg: 'bg-stone-200 text-stone-900 border-stone-300' },
    ],
    particleType: 'mouse_cheese',
  },

  hada_dientes: {
    greeting: (name) => `¡Hola, dulzura mágica ${name || 'pequeña estrella'}! 🧚‍♀️✨🌸`,
    p1: ({ city, achievement }) =>
      `¡Soy el Hada de los Dientes! Te mando un rayito de luz desde el Valle de las Sonrisas Brillantes. Mis alas transparentes han empezado a tintinear como campanitas de cristal cuando los vientos mágicos me trajeron noticias desde ${city || 'tu ventana'}. ¡Me han contado que has conseguido ${achievement || 'ser tan valiente y sonreír con tanta fuerza'}! ¡He esparcido polvo de estrellas por todo mi jardín de la alegría! 🌸✨`,
    p2: ({ behavior }) =>
      `Cada vez que un/a niño/a es tan bueno/a al ${behavior || 'cuidar a los demás con dulzura y compartir sus juguetes'}, nace una flor luminosa en mi castillo de nubes. ¡Tu jardín ya está lleno de margaritas de oro! 🌼💫`,
    giftParagraph: (gift) =>
      `Con mi varita de plata he encantado un regalo precioso para ti: "${gift}". ¡Lleva un poquito de brillo mágico que te acompañará en tus sueños! 🪄✨`,
    defaultAdvice:
      `Deja tu diente bajo la almohada y cierra los ojos soñando con castillos de algodón. Cuando sientas una brisa tibia en tu mejilla, sabré que ya estás soñando con las estrellas. 🌙✨`,
    finalMessage: (name) =>
      `¡Tu sonrisa ilumina el mundo entero, dulce ${name || 'soñador/a'}! ¡Nunca dejes de soñar y brillar!`,
    valediction: 'Bañándote con polvo de hadas, besos de luz y destellos rosas,',
    signature: 'Aura, Hada de los Dientes 🧚‍♀️✨',
    sealLabel: 'HADA REAL',
    sealIcon: '✨',
    funBadge: {
      title: 'BRILO DE ESTRELLA REAL',
      subtitle: 'Premio a la Dulzura y Sonrisa Radiante',
      icon: '🧚',
      color: 'purple',
    },
    stickers: [
      { emoji: '🪄', text: 'Polvo de Hadas', bg: 'bg-purple-100 text-purple-900 border-purple-300' },
      { emoji: '🌸', text: 'Sonrisa Brillante', bg: 'bg-pink-100 text-pink-900 border-pink-300' },
      { emoji: '✨', text: 'Magia Pura', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    ],
    particleType: 'fairy_dust',
  },

  elfo: {
    greeting: (name) => `¡¡Ey, compañero/a de travesuras ${name || 'monstruito/a simpático/a'}!! 🧝‍♂️🔔🎉`,
    p1: ({ city, achievement }) =>
      `¡Soy Pippin, el Elfo Travieso de la Navidad! (Te escribo mientras estoy colgado boca abajo de la lámpara del taller comiéndome un bastón de caramelo 🍭). ¡Toda la patrulla de elfos en ${city || 'tu zona'} está alucinando porque has logrado ${achievement || 'hacer cosas tan geniales y aprender sin parar'}! Casi se me cae el gorro puntiagudo al suelo de la risa. 🎪🧝`,
    p2: ({ behavior }) =>
      `Los elfos somos expertos en hacer bromas divertidas, pero sabemos reconocer a un/a auténtico/a fuera de serie cuando lo vemos. Me encanta que seas tan cariñoso/a y te portes tan bien al ${behavior || 'dar abrazos y alegrar a todos en casa'}. ¡Ese sí que es un truco maestro! 🃏✨`,
    giftParagraph: (gift) =>
      `¡Menuda elección con "${gift}"! He convencido a los otros elfos para envolverlo con triple cinta de purpurina y un cascabel que suena cuando lo tocas. ¡Vas a alucinar! 🎁🔔`,
    defaultAdvice:
      `Prométeme una cosa: sigue riéndote fuerte todos los días, cómete la merienda y no hagas demasiadas trastadas (¡déjame las travesuras a mí, que soy un profesional!). 😜🎉`,
    finalMessage: (name) =>
      `¡Choca esos cuatro dedos élficos, campeón/a ${name || 'pillo/a'}! ¡Que no paren las risas!`,
    valediction: 'Con cascabeles, serpentinas y un guiño travieso,',
    signature: 'Pippin el Elfo Travieso 🧝‍♂️🔔',
    sealLabel: 'ELFO REAL',
    sealIcon: '🔔',
    funBadge: {
      title: 'CLUB DE TRAVESURAS SANAS',
      subtitle: 'Compañero Oficial de Risas y Bromas',
      icon: '🧝',
      color: 'emerald',
    },
    stickers: [
      { emoji: '🔔', text: 'Cascabel Alegre', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
      { emoji: '🍭', text: 'Dulce Navideño', bg: 'bg-rose-100 text-rose-900 border-rose-300' },
      { emoji: '😜', text: '100% Risas', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    ],
    particleType: 'elf_bells',
  },
};
