import { ref } from 'vue'

/* ── Locale state ── */
const locale = ref(
  localStorage.getItem('pawpost_lang') ||
  (navigator.language?.startsWith('pt') ? 'pt' : 'en')
)

/* ── Rotating typewriter phrases per locale ── */
export const rotatingPhrasesI18n = {
  en: [
    'Start posting.',
    'Start booking.',
    'Start standing out.',
    'Get your weekends back.',
    'Let AI do the work.',
    'Go walk some dogs.',
  ],
  pt: [
    'Comece a postar.',
    'Comece a agendar.',
    'Destaque-se.',
    'Tenha seus fins de semana de volta.',
    'Deixe a IA trabalhar.',
    'Vá passear com os dogs.',
  ],
}

/* ── All translations ── */
const translations = {
  en: {
    /* Nav */
    navCta: 'Get Started Free',

    /* Hero */
    badge: 'AI-powered captions for pet businesses 🐾',
    heroH1: 'Stop writing captions.',
    heroSub1: '30 days of social media captions for your pet business, generated in 60 seconds.',
    heroSub2: 'Captions that actually sound like',
    heroSub3: 'you',
    heroSub4: ', not a robot!',
    heroCta: 'Generate My Free Caption Pack →',
    heroNote: 'No credit card required. Takes 60 seconds.',

    /* Pills */
    pillGroomers: 'Groomers',
    pillWalkers: 'Walkers',
    pillTrainers: 'Trainers',
    pillSitters: 'Sitters',
    pillDaycares: 'Daycares',
    pillVets: 'Vet Clinics',
    pillSuppliers: 'Suppliers',
    pillFoodBrands: 'Food Brands',
    pillWholesale: 'Importers',
    pillInsurance: 'Pet Insurance',
    pillEducation: 'Pet Courses',

    /* Hero card */
    heroCardBiz: 'Pawfect Grooming',
    heroCardMeta: 'Monday · Instagram ·',
    heroCardStatus: 'Ready to post',
    heroCardText: "Monday mood: that look your dog gives you when they realize they're at the groomer, not the park. Don't worry buddy, you'll thank us later! 😂🐕",
    heroCardPhoto: '📸 Photo idea included',

    /* Marquee */
    marquee: 'GROOMERS · WALKERS · TRAINERS · SITTERS · DAYCARES · VET CLINICS · PET PHOTOGRAPHERS · PET STORES · SUPPLIERS · FOOD BRANDS · IMPORTERS · PET INSURANCE · PET COURSES ·',

    /* Calculator */
    calcH2: "You're burning",
    calcH2em: 'real money',
    calcH2end: 'on captions',
    calcSub: "Every hour you spend staring at a blank caption box is an hour you're not grooming, training, or booking clients.",
    calcLabel: 'Hours per week on captions',
    calcHoursYear: 'hours wasted per year',
    calcMonthMsg: 'hours every month',
    calcGone: '— gone.',
    calcCostPre: "At $25/hr, you're losing",
    calcCostPost: '/year',
    calcFix: 'PawPost does it in',
    calcFixBold: '60 seconds',
    calcFixEnd: '. For',
    calcFixCost: 'less than $1/day',

    /* Before / After */
    baH2: 'Two realities.',
    baH2em: 'Pick one.',
    baSub: 'This is what changes when you stop doing it all yourself.',
    baWithout: 'Without PawPost',
    baWith: 'With PawPost AI',
    baBefore1: 'Sunday night blank-screen paralysis',
    baBefore2: 'Post once, ghost for two weeks, repeat',
    baBefore3: 'Captions that sound corporate and lifeless',
    baBefore4: 'Zero idea what photo to pair with your post',
    baBefore5: 'Competitors outposting you 5:1',
    baNudge: 'Toggle right to see the difference →',
    baAfter1: '30 days of content, generated in 60 seconds',
    baAfter2: 'Daily posts that build trust and bookings',
    baAfter3: 'Your voice, your personality, your brand',
    baAfter4: 'Photo ideas paired with every caption',
    baAfter5: 'Consistent presence that attracts new clients',
    baCtaBtn: 'Start for free →',

    /* How it works */
    stepsH2: '60 seconds. 30 days of content.',
    stepsSub: 'Three steps. No learning curve. No templates to customize.',
    step1Title: 'Describe your business',
    step1Desc: '60-second quiz — your services, your tone, your audience. Done.',
    step2Title: 'AI generates your month',
    step2Desc: '30 unique captions, hashtags, and photo ideas — written in your voice.',
    step3Title: 'Copy. Post. Move on.',
    step3Desc: 'Open your calendar, tap to copy, paste into Instagram. That\'s it.',
    stepsCta: 'Try it free →',

    /* Caption preview */
    previewH2: 'This is what you get.',
    previewSub: 'Real captions. For real pet businesses. Ready to post.',
    copyBtn: '📋 Copy this caption',
    copiedBtn: '✅ Copied! Try it on your Instagram',

    /* Competitor */
    diffH2: 'Buffer is for marketing teams.',
    diffH2em: 'This is for you.',
    diffBody1: 'Generic tools give you a blank box and say "write something." They treat a dog groomer the same as a Fortune 500 brand manager.',
    diffBody2: "PawPost knows the difference between a groom-day reveal, a holiday pet safety tip, and a booking CTA for a grooming salon. Because that's",
    diffBody2Bold: 'all we do',
    diffThemLabel: 'Generic tools',
    diffThem1: 'Blank text box — you still write everything',
    diffThem2: 'Generic AI that sounds like a press release',
    diffThem3: 'No idea what photo to pair',
    diffThem4: 'Zero pet industry awareness',
    diffUsLabel: 'PawPost AI',
    diffUs1: '30 done-for-you captions, instantly',
    diffUs2: 'Sounds like YOU — playful, warm, real',
    diffUs3: 'Photo idea with every single caption',
    diffUs4: 'Pet holidays, seasonal themes, your services',

    /* Testimonials */
    proofH2: 'Real results from real pet businesses.',
    proofSub: 'Click a card to see the numbers.',
    proofTapResults: 'tap to see results →',
    proofTapReview: '← tap to read review',

    /* Pricing */
    pricingH2: 'Less than $1/day.',
    pricingH2em: '15+ hours back every month.',
    pricingSub: 'No contracts. No lock-in. Cancel anytime.',
    pricingFreeName: 'Free',
    pricingFreePrice: '$0',
    pricingFreePeriod: 'Try it out, no strings attached',
    pricingFree1: '7 captions + hashtags',
    pricingFree2: 'Photo ideas included',
    pricingFree3: 'Content calendar',
    pricingFree4: '1 platform (Instagram)',
    pricingFreeBtn: 'Start Free',
    pricingPopBadge: 'Most Popular',
    pricingPremName: 'Premium',
    pricingPremPeriod: 'Everything you need to post consistently',
    pricingPrem1: '30 captions + hashtags',
    pricingPrem2: 'Photo ideas for every post',
    pricingPrem3: 'Instagram, Facebook, TikTok',
    pricingPrem4: 'Brand voice settings',
    pricingPrem5: 'Caption variants',
    pricingPrem6: 'CSV export',
    pricingPremBtn: 'Start 14-Day Free Trial →',
    pricingPremNote: 'No credit card required',
    pricingProBadge: 'Pro',
    pricingProName: 'Premium Pro',
    pricingProPeriod: 'For serious pet businesses ready to scale',
    pricingPro1: 'Everything in Premium',
    pricingPro2: 'Multi-account support',
    pricingPro3: 'Advanced brand voice AI',
    pricingPro4: 'Priority caption generation',
    pricingPro5: 'Competitor caption analysis',
    pricingPro6: 'Dedicated support',
    pricingAnchor1: "You're spending ~",
    pricingAnchor2: ' hours/month',
    pricingAnchor3: ' on captions. That\'s ',
    pricingAnchor4: ' in lost time. PawPost Pro costs ',
    pricingAnchor5: '$14',
    pricingAnchor6: '. Do the math.',

    /* Newsletter */
    nlH2: 'Free weekly caption ideas',
    nlSub: 'Marketing tips for pet businesses. Delivered every Monday. No fluff.',
    nlPlaceholder: 'your@email.com',
    nlBtn: 'Subscribe →',
    nlTrust: 'Join',
    nlTrustCount: '2,400+',
    nlTrustEnd: 'pet business owners · Unsubscribe anytime',
    nlSuccess: "You're in! We'll keep you posted with fresh caption ideas. 🐾",

    /* Final CTA */
    finalPre: 'Bottom line',
    finalH2a: 'You started this business to',
    finalH2b: 'work with animals —',
    finalH2em: 'not to write Instagram captions.',
    finalSub: 'Get 30 days of content in 60 seconds. Free.',
    finalCta: 'Generate My Free Caption Pack →',
    finalNote: 'No credit card. No catch. Takes 60 seconds.',

    /* Popup */
    popupTitle: 'Free: 10 Instagram Caption Templates for Pet Businesses 🐾',
    popupSub: 'Steal these ready-to-post captions — no writing required.',
    popupBtn: 'Send Me The Templates 🐾',
    popupDismiss: 'Nah, I love writing captions 😅',
    popupSuccessTitle: 'Check your inbox! 📬',
    popupSuccessSub: 'Your 10 free caption templates are on the way. Go pet a dog while you wait! 🐶💛',

    /* Footer */
    footerText: 'Social media captions made for pet businesses — not marketing teams.',
  },

  pt: {
    /* Nav */
    navCta: 'Comece Grátis',

    /* Hero */
    badge: 'Legendas com IA para pet businesses 🐾',
    heroH1: 'Pare de escrever legendas.',
    heroSub1: '30 dias de legendas para redes sociais do seu pet business, geradas em 60 segundos.',
    heroSub2: 'Legendas que realmente soam como',
    heroSub3: 'você',
    heroSub4: ', não um robô!',
    heroCta: 'Gerar Meu Pack de Legendas Grátis →',
    heroNote: 'Sem cartão de crédito. Leva 60 segundos.',

    /* Pills */
    pillGroomers: 'Banho & Tosa',
    pillWalkers: 'Dog Walkers',
    pillTrainers: 'Adestradores',
    pillSitters: 'Pet Sitters',
    pillDaycares: 'Creches',
    pillVets: 'Clínicas Vet',
    pillSuppliers: 'Distribuidores',
    pillFoodBrands: 'Marcas de Ração',
    pillWholesale: 'Importadores',
    pillInsurance: 'Seguro Pet',
    pillEducation: 'Cursos Pet',

    /* Hero card */
    heroCardBiz: 'Pawfect Grooming',
    heroCardMeta: 'Segunda · Instagram ·',
    heroCardStatus: 'Pronto para postar',
    heroCardText: 'Mood de segunda: aquele olhar do dog quando ele percebe que está no petshop, não no parque. Relaxa amigo, depois você agradece! 😂🐕',
    heroCardPhoto: '📸 Ideia de foto incluída',

    /* Marquee */
    marquee: 'BANHO & TOSA · DOG WALKERS · ADESTRADORES · PET SITTERS · CRECHES · CLÍNICAS VET · PET FOTÓGRAFOS · PET SHOPS · DISTRIBUIDORES · MARCAS DE RAÇÃO · IMPORTADORES · SEGURO PET · CURSOS PET ·',

    /* Calculator */
    calcH2: 'Você está queimando',
    calcH2em: 'dinheiro real',
    calcH2end: 'em legendas',
    calcSub: 'Cada hora que você passa olhando para uma legenda em branco é uma hora que você não está atendendo, treinando ou agendando clientes.',
    calcLabel: 'Horas por semana em legendas',
    calcHoursYear: 'horas perdidas por ano',
    calcMonthMsg: 'horas por mês',
    calcGone: '— perdidas.',
    calcCostPre: 'A $25/hr, você está perdendo',
    calcCostPost: '/ano',
    calcFix: 'O PawPost faz isso em',
    calcFixBold: '60 segundos',
    calcFixEnd: '. Por',
    calcFixCost: 'menos de $1/dia',

    /* Before / After */
    baH2: 'Duas realidades.',
    baH2em: 'Escolha uma.',
    baSub: 'Isso é o que muda quando você para de fazer tudo sozinho.',
    baWithout: 'Sem PawPost',
    baWith: 'Com PawPost AI',
    baBefore1: 'Paralisia da tela em branco no domingo à noite',
    baBefore2: 'Posta uma vez, some por duas semanas, repete',
    baBefore3: 'Legendas que soam corporativas e sem vida',
    baBefore4: 'Nenhuma ideia de que foto combinar com o post',
    baBefore5: 'Concorrentes postando 5x mais que você',
    baNudge: 'Toque à direita para ver a diferença →',
    baAfter1: '30 dias de conteúdo, gerado em 60 segundos',
    baAfter2: 'Posts diários que geram confiança e agendamentos',
    baAfter3: 'Sua voz, sua personalidade, sua marca',
    baAfter4: 'Ideias de fotos para cada legenda',
    baAfter5: 'Presença consistente que atrai novos clientes',
    baCtaBtn: 'Comece grátis →',

    /* How it works */
    stepsH2: '60 segundos. 30 dias de conteúdo.',
    stepsSub: 'Três passos. Sem curva de aprendizado. Sem templates para customizar.',
    step1Title: 'Descreva seu negócio',
    step1Desc: 'Quiz de 60 segundos — seus serviços, seu tom, seu público. Pronto.',
    step2Title: 'A IA gera seu mês',
    step2Desc: '30 legendas únicas, hashtags e ideias de fotos — escritas com a sua voz.',
    step3Title: 'Copie. Poste. Siga em frente.',
    step3Desc: 'Abra o calendário, copie, cole no Instagram. É isso.',
    stepsCta: 'Experimente grátis →',

    /* Caption preview */
    previewH2: 'Isso é o que você recebe.',
    previewSub: 'Legendas reais. Para pet businesses reais. Prontas para postar.',
    copyBtn: '📋 Copiar esta legenda',
    copiedBtn: '✅ Copiado! Teste no seu Instagram',

    /* Competitor */
    diffH2: 'Buffer é para equipes de marketing.',
    diffH2em: 'Isso é para você.',
    diffBody1: 'Ferramentas genéricas dão uma caixa em branco e dizem "escreva algo." Tratam um pet groomer igual a um gerente de marketing de multinacional.',
    diffBody2: 'O PawPost sabe a diferença entre um reveal de banho & tosa, uma dica de segurança pet e um CTA de agendamento. Porque é',
    diffBody2Bold: 'tudo que fazemos',
    diffThemLabel: 'Ferramentas genéricas',
    diffThem1: 'Caixa de texto em branco — você ainda escreve tudo',
    diffThem2: 'IA genérica que soa como comunicado de imprensa',
    diffThem3: 'Nenhuma ideia de foto',
    diffThem4: 'Zero conhecimento do setor pet',
    diffUsLabel: 'PawPost AI',
    diffUs1: '30 legendas prontas, instantaneamente',
    diffUs2: 'Soa como VOCÊ — divertido, caloroso, real',
    diffUs3: 'Ideia de foto para cada legenda',
    diffUs4: 'Feriados pet, temas sazonais, seus serviços',

    /* Testimonials */
    proofH2: 'Resultados reais de pet businesses reais.',
    proofSub: 'Clique em um card para ver os números.',
    proofTapResults: 'toque para ver resultados →',
    proofTapReview: '← toque para ler avaliação',

    /* Pricing */
    pricingH2: 'Menos de $1/dia.',
    pricingH2em: '15+ horas de volta todo mês.',
    pricingSub: 'Sem contratos. Sem fidelidade. Cancele a qualquer momento.',
    pricingFreeName: 'Grátis',
    pricingFreePrice: '$0',
    pricingFreePeriod: 'Experimente sem compromisso',
    pricingFree1: '7 legendas + hashtags',
    pricingFree2: 'Ideias de fotos incluídas',
    pricingFree3: 'Calendário de conteúdo',
    pricingFree4: '1 plataforma (Instagram)',
    pricingFreeBtn: 'Comece Grátis',
    pricingPopBadge: 'Mais Popular',
    pricingPremName: 'Premium',
    pricingPremPeriod: 'Tudo que você precisa para postar com consistência',
    pricingPrem1: '30 legendas + hashtags',
    pricingPrem2: 'Ideias de fotos para cada post',
    pricingPrem3: 'Instagram, Facebook, TikTok',
    pricingPrem4: 'Configurações de voz da marca',
    pricingPrem5: 'Variantes de legenda',
    pricingPrem6: 'Exportar CSV',
    pricingPremBtn: 'Iniciar Teste Grátis de 14 Dias →',
    pricingPremNote: 'Sem cartão de crédito',
    pricingProBadge: 'Pro',
    pricingProName: 'Premium Pro',
    pricingProPeriod: 'Para pet businesses sérios prontos para escalar',
    pricingPro1: 'Tudo do Premium',
    pricingPro2: 'Suporte multi-conta',
    pricingPro3: 'IA avançada de voz da marca',
    pricingPro4: 'Geração prioritária de legendas',
    pricingPro5: 'Análise de legendas dos concorrentes',
    pricingPro6: 'Suporte dedicado',
    pricingAnchor1: 'Você gasta ~',
    pricingAnchor2: ' horas/mês',
    pricingAnchor3: ' em legendas. Isso é ',
    pricingAnchor4: ' em tempo perdido. PawPost Pro custa ',
    pricingAnchor5: '$14',
    pricingAnchor6: '. Faça as contas.',

    /* Newsletter */
    nlH2: 'Ideias de legendas grátis toda semana',
    nlSub: 'Dicas de marketing para pet businesses. Toda segunda-feira. Sem enrolação.',
    nlPlaceholder: 'seu@email.com',
    nlBtn: 'Inscrever-se →',
    nlTrust: 'Junte-se a',
    nlTrustCount: '2.400+',
    nlTrustEnd: 'donos de pet businesses · Cancele a qualquer momento',
    nlSuccess: 'Você está dentro! Vamos te enviar ideias fresquinhas de legendas. 🐾',

    /* Final CTA */
    finalPre: 'Resumindo',
    finalH2a: 'Você começou esse negócio para',
    finalH2b: 'trabalhar com animais —',
    finalH2em: 'não para escrever legendas de Instagram.',
    finalSub: '30 dias de conteúdo em 60 segundos. Grátis.',
    finalCta: 'Gerar Meu Pack de Legendas Grátis →',
    finalNote: 'Sem cartão. Sem pegadinhas. Leva 60 segundos.',

    /* Popup */
    popupTitle: 'Grátis: 10 Templates de Legendas para Instagram para Pet Businesses 🐾',
    popupSub: 'Pegue essas legendas prontas para postar — sem escrever nada.',
    popupBtn: 'Envie-me os Templates 🐾',
    popupDismiss: 'Não, eu amo escrever legendas 😅',
    popupSuccessTitle: 'Confira seu email! 📬',
    popupSuccessSub: 'Seus 10 templates de legendas grátis estão a caminho. Vá fazer carinho em um dog enquanto espera! 🐶💛',

    /* Footer */
    footerText: 'Legendas para redes sociais feitas para pet businesses — não equipes de marketing.',
  },
}

/**
 * Lightweight i18n composable for PawPost
 * Usage: const { t, locale, setLocale } = useI18n()
 */
export function useI18n() {
  function t(key) {
    return translations[locale.value]?.[key] || translations.en[key] || key
  }

  function setLocale(l) {
    locale.value = l
    localStorage.setItem('pawpost_lang', l)
  }

  return { t, locale, setLocale }
}
