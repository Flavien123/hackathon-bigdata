export type Locale = "ru" | "kk"

export const translations = {
  ru: {
    // Header
    appTitle: "Транспортный надзор",
    appDescription: "Сообщите о проблемах в общественном транспорте",

    // Form
    problemDescription: "Описание проблемы",
    describeDetail: "Опишите ситуацию подробно",
    yourComplaint: "Ваша жалоба",
    required: "*",
    optional: "(необязательно)",
    complaintPlaceholder: "Опишите проблему, с которой вы столкнулись...",
    exampleComplaints: "Примеры жалоб:",
    examples: [
      "Водитель превысил скорость и не соблюдал ПДД",
      "Автобус не остановился на остановке",
      "Водитель разговаривал по телефону во время движения",
      "В салоне не работает кондиционер",
    ],

    // Bus data
    busData: "Данные автобуса",
    scanQR: "Сканировать QR-код",
    change: "Изменить",
    qrParseError: "Не удалось распознать данные. Отсканируйте QR-код повторно.",
    route: "Маршрут",
    bus: "Автобус",

    // Location
    location: "Местоположение",
    getLocation: "Получить местоположение",
    determining: "Определение...",
    accuracy: "Точность",
    meters: "м",
    remove: "Удалить",
    locationNotSupported: "Геолокация не поддерживается вашим устройством",
    locationDenied: "Доступ к геолокации запрещен",
    locationUnavailable: "Местоположение недоступно",
    locationTimeout: "Время ожидания истекло",
    locationError: "Не удалось получить местоположение",

    // Media
    mediaFiles: "Фото или видео",

    // Submit
    submitComplaint: "Отправить жалобу",
    submitting: "Отправка...",
    complaintSent: "Жалоба отправлена",
    thankYou: "Спасибо за ваше обращение. Мы рассмотрим его в ближайшее время.",
    enterComplaint: "Пожалуйста, введите текст жалобы",
    submitError: "Ошибка при отправке жалобы",
    submitFailed: "Не удалось отправить жалобу",

    // Settings
    theme: "Тема",
    language: "Язык",
    light: "Светлая",
    dark: "Темная",
    system: "Системная",
    russian: "Русский",
    kazakh: "Қазақша",
  },
  kk: {
    // Header
    appTitle: "Көлік қадағалауы",
    appDescription: "Қоғамдық көліктегі мәселелер туралы хабарлаңыз",

    // Form
    problemDescription: "Мәселенің сипаттамасы",
    describeDetail: "Жағдайды толық сипаттаңыз",
    yourComplaint: "Сіздің шағымыңыз",
    required: "*",
    optional: "(міндетті емес)",
    complaintPlaceholder: "Кездескен мәселені сипаттаңыз...",
    exampleComplaints: "Шағым үлгілері:",
    examples: [
      "Жүргізуші жылдамдықты асырды және ЖҚЕ сақтамады",
      "Автобус аялдамада тоқтамады",
      "Жүргізуші қозғалыс кезінде телефонмен сөйлесті",
      "Салонда кондиционер жұмыс істемейді",
    ],

    // Bus data
    busData: "Автобус деректері",
    scanQR: "QR-кодты сканерлеу",
    change: "Өзгерту",
    qrParseError: "Деректерді тану мүмкін болмады. QR-кодты қайта сканерлеңіз.",
    route: "Бағыт",
    bus: "Автобус",

    // Location
    location: "Орналасқан жері",
    getLocation: "Орналасқан жерді алу",
    determining: "Анықтау...",
    accuracy: "Дәлдік",
    meters: "м",
    remove: "Жою",
    locationNotSupported: "Геолокация құрылғыңызда қолдау көрсетілмейді",
    locationDenied: "Геолокацияға қол жеткізу тыйым салынды",
    locationUnavailable: "Орналасқан жер қолжетімді емес",
    locationTimeout: "Күту уақыты аяқталды",
    locationError: "Орналасқан жерді алу мүмкін болмады",

    // Media
    mediaFiles: "Фото немесе бейне",

    // Submit
    submitComplaint: "Шағым жіберу",
    submitting: "Жіберілуде...",
    complaintSent: "Шағым жіберілді",
    thankYou: "Өтінішіңізге рахмет. Біз оны жақын арада қарастырамыз.",
    enterComplaint: "Шағым мәтінін енгізіңіз",
    submitError: "Шағым жіберу кезінде қате",
    submitFailed: "Шағым жіберу мүмкін болмады",

    // Settings
    theme: "Тақырып",
    language: "Тіл",
    light: "Ашық",
    dark: "Қараңғы",
    system: "Жүйелік",
    russian: "Русский",
    kazakh: "Қазақша",
  },
} as const

export function useTranslation(locale: Locale) {
  return translations[locale]
}
