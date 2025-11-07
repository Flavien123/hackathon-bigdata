export const translations = {
  ru: {
    // Header
    title: "Панель жалоб на транспорт",
    subtitle: "Мониторинг и анализ жалоб на автобусные маршруты в реальном времени",
    updating: "Обновление каждые 5 сек",

    // Stats
    totalComplaints: "Всего жалоб",
    routesWithComplaints: "Маршрутов с жалобами",
    highPriority: "Высокий приоритет",

    // Charts
    problematicRoutes: "Самые проблемные маршруты",
    topRoutes: "Топ-10 маршрутов по количеству жалоб",
    levelDistribution: "Распределение жалоб по уровням",
    levelStackChart: "Стековая диаграмма критичности жалоб",
    categoryFrequency: "Частота аспектов по категориям",
    categoryDistribution: "Распределение жалоб по типам проблем",

    // Levels
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",

    // Categories
    delay: "Задержка",
    safety_issue: "Безопасность",
    cleanliness: "Чистота",
    driver_behavior: "Поведение водителя",
    technical_issue: "Технические проблемы",
    overcrowding: "Переполненность",
    route_issue: "Проблемы с маршрутом",

    // General
    route: "Маршрут",
    complaintsCount: "Количество жалоб",
    noData: "Нет данных для отображения",
    errorLoading: "Ошибка загрузки данных",
    errorMessage: "Не удалось подключиться к API. Проверьте подключение к базе данных.",

    // Filters
    filters: "Фильтры",
    searchRoute: "Поиск по маршруту",
    routeNumber: "Номер маршрута",
    filterByCategory: "Категория",
    filterByLevel: "Уровень",
    allCategories: "Все категории",
    allLevels: "Все уровни",
    sortBy: "Сортировать",
    byCount: "По количеству",
    byRoute: "По маршруту",
    byTime: "По времени",
    dateRange: "Период",
    selectDate: "Выбрать даты",
    reset: "Сбросить",
  },
  kk: {
    // Header
    title: "Көлік шағымдары панелі",
    subtitle: "Автобус бағыттары бойынша шағымдарды нақты уақытта бақылау және талдау",
    updating: "Әр 5 секундта жаңарту",

    // Stats
    totalComplaints: "Барлық шағымдар",
    routesWithComplaints: "Шағымдары бар бағыттар",
    highPriority: "Жоғары басымдық",

    // Charts
    problematicRoutes: "Ең проблемалы бағыттар",
    topRoutes: "Шағым саны бойынша топ-10 бағыттар",
    levelDistribution: "Шағымдардың деңгейлері бойынша үлестірімі",
    levelStackChart: "Шағымдардың маңыздылығының стектік диаграммасы",
    categoryFrequency: "Санаттар бойынша аспектілердің жиілігі",
    categoryDistribution: "Мәселе түрлері бойынша шағымдардың үлестірімі",

    // Levels
    high: "Жоғары",
    medium: "Орташа",
    low: "Төмен",

    // Categories
    delay: "Кешігу",
    safety_issue: "Қауіпсіздік",
    cleanliness: "Тазалық",
    driver_behavior: "Жүргізушінің мінез-құлқы",
    technical_issue: "Техникалық мәселелер",
    overcrowding: "Тығыздық",
    route_issue: "Бағыт мәселелері",

    // General
    route: "Бағыт",
    complaintsCount: "Шағымдар саны",
    noData: "Көрсету үшін деректер жоқ",
    errorLoading: "Деректерді жүктеу қатесі",
    errorMessage: "API-ге қосылу мүмкін болмады. Дерекқорға қосылымды тексеріңіз.",

    // Filters
    filters: "Сүзгілер",
    searchRoute: "Бағыт бойынша іздеу",
    routeNumber: "Бағыт нөмірі",
    filterByCategory: "Санат",
    filterByLevel: "Деңгей",
    allCategories: "Барлық санаттар",
    allLevels: "Барлық деңгейлер",
    sortBy: "Сұрыптау",
    byCount: "Саны бойынша",
    byRoute: "Бағыт бойынша",
    byTime: "Уақыты бойынша",
    dateRange: "Кезең",
    selectDate: "Күндерді таңдау",
    reset: "Тазалау",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof (typeof translations)["ru"]
