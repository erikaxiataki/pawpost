// Dynamic newsletter content builder
// Assembles personalized content from existing captions.js data — zero AI calls
import { captionTemplates, petHolidays, trendingSounds, platformFormats } from './captions.js'

const REFERENCE_DATE = new Date('2025-03-03')

const labels = {
  en: {
    captionOfWeek: 'Caption of the Week',
    readyToPost: 'Ready to post — just copy & paste!',
    upcomingHoliday: 'Coming Up',
    daysAway: 'days away',
    tomorrow: 'Tomorrow!',
    today: 'Today!',
    trendingSound: 'Trending Sound',
    soundTip: 'Use this sound for',
    seasonalTip: 'Tip of the Month',
    hashtags: 'Hashtags',
    photoIdea: 'Photo idea',
    generateMore: 'Generate more captions',
    weeklyNewsletter: 'Your weekly caption + tips',
  },
  pt: {
    captionOfWeek: 'Legenda da Semana',
    readyToPost: 'Pronto pra postar — copie e cole!',
    upcomingHoliday: 'Em Breve',
    daysAway: 'dias',
    tomorrow: 'Amanha!',
    today: 'Hoje!',
    trendingSound: 'Som em Alta',
    soundTip: 'Use esse som para',
    seasonalTip: 'Dica do Mes',
    hashtags: 'Hashtags',
    photoIdea: 'Ideia de foto',
    generateMore: 'Gerar mais legendas',
    weeklyNewsletter: 'Sua legenda semanal + dicas',
  },
}

function getWeekNum(today) {
  return Math.floor((today - REFERENCE_DATE) / (7 * 24 * 60 * 60 * 1000))
}

export function getUpcomingHoliday(today = new Date()) {
  const month = today.getMonth()
  const day = today.getDate()

  let best = null
  let bestDays = Infinity

  for (const h of petHolidays) {
    // Calculate days until this holiday
    const holidayDate = new Date(today.getFullYear(), h.month, h.day)
    // If holiday already passed this year, try next year
    if (holidayDate < today) {
      holidayDate.setFullYear(holidayDate.getFullYear() + 1)
    }
    const daysUntil = Math.ceil((holidayDate - today) / (24 * 60 * 60 * 1000))

    if (daysUntil <= 14 && daysUntil < bestDays) {
      best = { ...h, daysUntil }
      bestDays = daysUntil
    }
  }

  return best
}

export function pickCaptionOfWeek(businessTypeId = 'groomer', today = new Date()) {
  const weekNum = getWeekNum(today)
  const templates = captionTemplates[businessTypeId] || captionTemplates.groomer
  const idx = Math.abs(weekNum) % templates.length
  return templates[idx]
}

export function pickTrendingSound(today = new Date()) {
  const weekNum = getWeekNum(today)
  // Flatten all sounds into one array
  const allSounds = Object.values(trendingSounds).flat()
  const idx = Math.abs(weekNum) % allSounds.length
  return allSounds[idx]
}

const seasonalTips = {
  en: [
    // Jan
    "New Year's resolution posts perform great in January. Ask your audience: 'What's your pet's resolution this year?' — engagement guaranteed!",
    // Feb
    "Valentine's Day is huge for pet content. 'Who's your Valentine?' posts featuring pets get massive shares. Plan one this week!",
    // Mar
    "Spring is coming! Post about seasonal pet safety: allergies, ticks, and garden dangers. Educational content gets saved the most.",
    // Apr
    "April is prime outdoor season. Action shots of pets playing outside get 2x more engagement than indoor photos.",
    // May
    "Mother's Day + pet moms = content gold. Don't miss this one — 'pet mom' posts trend hard in May.",
    // Jun
    "Summer heat safety content is essential. 'Hot pavement test' posts go viral every year. Be the first to post it!",
    // Jul
    "Fireworks anxiety content peaks in July. Share calming tips — pet parents will save and share like crazy.",
    // Aug
    "Back-to-school means pets are home alone more. Separation anxiety tips perform incredibly well this month.",
    // Sep
    "Fall content gets cozy vibes. Pumpkin-themed pet photos, leaf piles, and sweater weather = peak engagement.",
    // Oct
    "Halloween pet costumes are THE most shareable pet content of the year. Start posting costume ideas early!",
    // Nov
    "Holiday booking season starts NOW. Create urgency: 'December spots are filling fast!' works every time.",
    // Dec
    "Year-end recap posts get huge engagement. Share your 'year in numbers' and thank your community.",
  ],
  pt: [
    "Posts de resolucao de Ano Novo funcionam otimo em janeiro. Pergunte: 'Qual a resolucao do seu pet?' — engajamento garantido!",
    "Dia dos Namorados e otimo pra conteudo pet. Posts 'Quem e seu Valentine?' com pets viralizam facil.",
    "Primavera chegando! Poste sobre seguranca sazonal: alergias, carrapatos, perigos do jardim. Conteudo educativo e o mais salvo.",
    "Abril e epoca de atividades ao ar livre. Fotos de pets brincando fora tem 2x mais engajamento.",
    "Dia das Maes + maes de pet = ouro de conteudo. Posts 'mae de pet' bombam em maio.",
    "Conteudo de seguranca no calor e essencial. Post do 'teste do asfalto quente' viraliza todo ano!",
    "Conteudo sobre ansiedade com fogos atinge o pico em julho. Compartilhe dicas calmantes.",
    "Volta as aulas = pets ficam mais sozinhos. Dicas de ansiedade de separacao vao muito bem esse mes.",
    "Conteudo de outono tem clima aconchegante. Fotos com abobora, folhas e clima frio = pico de engajamento.",
    "Fantasias de Halloween sao O conteudo pet mais compartilhavel do ano. Comece a postar ideias cedo!",
    "Temporada de agendamentos de fim de ano comeca AGORA. Crie urgencia: 'Vagas de dezembro estao acabando!'",
    "Posts de retrospectiva do ano tem engajamento enorme. Compartilhe seu 'ano em numeros'.",
  ],
}

export function getSeasonalTip(today = new Date(), language = 'en') {
  const month = today.getMonth()
  const tips = seasonalTips[language] || seasonalTips.en
  return tips[month]
}

export function buildPersonalizedContent(profile, today = new Date()) {
  const {
    businessTypeId = 'groomer',
    language = 'en',
  } = profile

  const lang = labels[language] || labels.en

  return {
    labels: lang,
    caption: pickCaptionOfWeek(businessTypeId, today),
    holiday: getUpcomingHoliday(today),
    sound: pickTrendingSound(today),
    seasonalTip: getSeasonalTip(today, language),
    language,
    businessTypeId,
  }
}

export function buildSubject(content) {
  const lang = content.language === 'pt' ? 'pt' : 'en'
  const caption = content.caption
  const category = caption?.category || 'brand'

  const subjectMap = {
    en: {
      transformation: "This week's glow-up caption is ready",
      fun: "A fun caption to make your followers smile",
      educational: "Teach your audience something new this week",
      promo: "Time to promote — your caption is ready",
      testimonial: "Turn client love into your next post",
      trust: "Build trust with this week's caption",
      milestone: "Celebrate your wins this week",
      brand: "Your brand story caption is here",
      lifestyle: "Lifestyle content your followers will love",
      emotional: "A heartfelt caption for your community",
      engagement: "Get your audience talking this week",
    },
    pt: {
      transformation: "A legenda da semana ta pronta",
      fun: "Uma legenda divertida pro seu feed",
      educational: "Ensine algo novo essa semana",
      promo: "Hora de promover — sua legenda ta pronta",
      testimonial: "Transforme amor de cliente em post",
      trust: "Construa confianca com a legenda da semana",
      milestone: "Celebre suas conquistas essa semana",
      brand: "Sua legenda de marca chegou",
      lifestyle: "Conteudo lifestyle que seus seguidores vao amar",
      emotional: "Uma legenda de coracao pra sua comunidade",
      engagement: "Faca seu publico interagir essa semana",
    },
  }

  const subjects = subjectMap[lang] || subjectMap.en
  const base = subjects[category] || subjects.brand
  const holidayNote = content.holiday ? ` + ${content.holiday.icon} ${content.holiday.name}` : ''

  return `🐾 ${base}${holidayNote}`
}

export function buildNewsletterHtml(content) {
  const { labels: l, caption, holiday, sound, seasonalTip } = content

  const holidaySection = holiday ? `
    <div style="background:#fff;border-radius:12px;padding:20px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">📅 ${l.upcomingHoliday}</div>
      <div style="font-size:18px;margin-bottom:6px;">${holiday.icon} <strong>${holiday.name}</strong></div>
      <p style="color:#44403C;margin:0 0 6px;line-height:1.5;">${holiday.tip}</p>
      <span style="font-size:12px;color:#A8A29E;">${holiday.daysUntil === 0 ? l.today : holiday.daysUntil === 1 ? l.tomorrow : `${holiday.daysUntil} ${l.daysAway}`}</span>
    </div>` : ''

  const soundSection = sound ? `
    <div style="background:#fff;border-radius:12px;padding:20px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#7C3AED;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">🎵 ${l.trendingSound}</div>
      <div style="font-size:16px;font-weight:600;color:#7C3AED;margin-bottom:6px;">${sound.name}</div>
      <p style="color:#44403C;margin:0;line-height:1.5;">${l.soundTip}: ${sound.tip}</p>
      ${sound.platforms ? `<div style="margin-top:8px;font-size:11px;color:#A8A29E;">${sound.platforms.map(p => p === 'tiktok' ? '🎵 TikTok' : '📸 Instagram').join(' · ')}</div>` : ''}
    </div>` : ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:'Helvetica Neue',Arial,sans-serif;color:#1C1917;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:24px;margin:0 0 4px;color:#1C1917;">🐾 PawPost AI</h1>
      <p style="color:#A8A29E;margin:0;font-size:13px;">${l.weeklyNewsletter}</p>
    </div>

    <!-- Caption of the Week -->
    <div style="background:#fff;border-radius:16px;padding:28px;border:2px solid #D97706;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">✍️ ${l.captionOfWeek}</div>
      <p style="font-size:15px;line-height:1.7;color:#1C1917;margin:0 0 16px;white-space:pre-wrap;">${caption.text}</p>
      ${caption.hashtags ? `<div style="background:#FFF7ED;border-radius:8px;padding:12px;margin-bottom:12px;">
        <div style="font-size:11px;color:#D97706;font-weight:600;margin-bottom:4px;">${l.hashtags}</div>
        <p style="font-size:13px;color:#44403C;margin:0;line-height:1.5;">${caption.hashtags}</p>
      </div>` : ''}
      ${caption.imageIdea ? `<p style="font-size:12px;color:#78716C;margin:0;">📸 ${l.photoIdea}: ${caption.imageIdea}</p>` : ''}
      <p style="font-size:12px;color:#D97706;font-weight:600;margin:12px 0 0;">${l.readyToPost}</p>
    </div>

    ${holidaySection}
    ${soundSection}

    <!-- Seasonal Tip -->
    <div style="background:#fff;border-radius:12px;padding:20px;border:1px solid #E7E5E4;margin-bottom:24px;">
      <div style="font-size:12px;color:#059669;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">💡 ${l.seasonalTip}</div>
      <p style="color:#44403C;margin:0;line-height:1.7;">${seasonalTip}</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="https://pawpost.ca/dashboard" style="display:inline-block;background:#1C1917;color:#fff;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:600;font-size:15px;">${l.generateMore} →</a>
    </div>

    <div style="text-align:center;color:#A8A29E;font-size:12px;margin-top:32px;padding-top:24px;border-top:1px solid #E7E5E4;">
      <p style="margin:0 0 8px;">🐾 PawPost AI</p>
      <p style="margin:0 0 8px;"><a href="https://pawpost.ca" style="color:#D97706;">pawpost.ca</a></p>
      <p style="margin:0;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#A8A29E;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
}
