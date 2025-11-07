## Проект

Репозиторий "hackathon-bigdata" содержит приложение для приёма жалоб о проблемах в транспорте. Проект состоит из нескольких частей:

- `backend/` — FastAPI бэкенд, хранение жалоб в PostgreSQL (Neon), агент на pydantic-ai для обработки текста жалоб.
- `frontend/` — React/Next.js приложение (интерфейс для подачи жалоб).
- `dashboard/` — Next.js Dashboard (визуализация статистики, графики).

Ниже — краткая документация по API, переменным окружениям и инструкции по запуску.

## Структура репозитория

- `backend/` — Python проект (FastAPI). Основные файлы:
	- `backend/app/main.py` — точка входа приложения.
	- `backend/app/api.py` — маршруты API (`/api/complaints`).
	- `backend/app/schemas.py` — Pydantic-схемы для запросов/ответов.
	- `backend/app/agents.py` — интеграция с моделью (pydantic-ai, Google Gemini).
	- `backend/app/db.py` — SQLAlchemy-модели и репозиторий.
	- `backend/pyproject.toml` — зависимости.

- `frontend/` и `dashboard/` — фронтенд-приложения на Next.js. Содержат компоненты и настройки проекта.

## Требования

- Python >= 3.13 для `backend` (см. `backend/pyproject.toml`).
- Node.js + pnpm (или npm) для `frontend` и `dashboard`.
- Доступ к PostgreSQL-совместимой базе (в проекте используется Neon). В переменных окружения — URL подключения.

## Переменные окружения (важно)

Создайте в `backend/` файл `.env` или установите переменные окружения в окружении запуска:

- `GEMINI_API_KEY` — API-ключ для провайдера (используется в `pydantic_ai` GoogleProvider).
- `NEON_URL` — URL подключения к Postgres/Neon для SQLAlchemy (напр., `postgresql://user:pass@host:port/dbname`).

В `backend/app/config.py` также загружается файл `src/promt.txt` (инструкции для агента).

## Быстрый запуск — backend

1. Перейдите в папку `backend`:

```fish
cd backend
```

2. Создайте виртуальное окружение и установите зависимости:

```fish
python -m venv .venv
source .venv/bin/activate.fish
python -m pip install --upgrade pip
python -m pip install .
```

3. Создайте `.env` с `GEMINI_API_KEY` и `NEON_URL`.

4. Запустите сервер разработки (uvicorn):

```fish
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

После запуска API будет доступно по: `http://localhost:8000`.

## API — Endpoints

Бэкенд предоставляет простой API для создания и чтения жалоб.

1) POST /api/complaints

- Описание: Принимает текст жалобы, запускает агент для распознавания маршрута/номера автобуса и сохраняет запись в БД.
- Тело запроса (JSON) — схема `ComplaintCreate` (см. `backend/app/schemas.py`):

```json
{
	"complaint_text": "текст жалобы",
	"route_number_qr": "маршрут_из_QR_если_есть",
	"bus_number_qr": 123,
	"latitude": 51.12345,
	"longitude": 71.12345
}
```

- Ответ (успех):

```json
{ "status": "success" }
```

Примечания: агент (`agents.run_agent`) возвращает структуру `AgentResponse` с распознанными полями (route_number, bus_number, location, category, level, advice, time) — если часть данных отсутствует, предусмотрены поля `route_number_qr` и `bus_number_qr`, которые используются как fallback.

2) GET /api/complaints

- Возвращает список жалоб. Ответ соответствует `List[ComplaintRead]` (см. `backend/app/schemas.py`) — поля: route_number, bus_number, latitude, longitude, location, category, level, advice, text, time.

Пример ответа:

```json
[
	{
		"route_number": "42",
		"bus_number": "123",
		"latitude": 51.1,
		"longitude": 71.2,
		"location": "Остановка X",
		"category": "безопасность",
		"level": "высокий",
		"advice": "Свяжитесь с диспетчером",
		"text": "Описание проблемы",
		"time": "2025-11-07T12:34:56"
	}
]
```

## База данных

Проект использует SQLAlchemy и ожидает строку подключения в `NEON_URL`. В `backend/app/db.py` описана модель `Complaint` и репозиторий `ComplaintRepository`.

При первом запуске таблица `complaints` создаётся вызовом `Base.metadata.create_all(bind=engine)`.

## Frontend и Dashboard (кратко)

- `frontend/` и `dashboard/` — приложения на Next.js. Перейдите в соответствующие папки и установите зависимости через `pnpm install` или `npm install`.
- Стандартные команды для разработки:

```fish
cd frontend
pnpm install
pnpm dev

cd ../dashboard
pnpm install
pnpm dev
```

Интерфейсы ожидают API бэкенда на `http://localhost:8000` (см. CORS в `backend/app/main.py`).

## Отладка и частые проблемы

- Ошибка подключения к БД: проверьте `NEON_URL` и доступ из вашей сети.
- Ошибка авторизации модели: проверьте `GEMINI_API_KEY`.
- Модель `pydantic-ai` и провайдер Google ожидают корректный ключ и доступ в интернет.

## Дальнейшие шаги

- Добавить миграции (alembic) для управления схемой БД.
- Добавить защу и аутентификацию для API.
- Добавить тесты для репозитория и маршрутов.

---

Если хотите, могу дополнительно:
- сгенерировать примеры curl-запросов и тесты для API;
- добавить примеры request/response в OpenAPI (FastAPI уже генерирует документацию по адресу `/docs`).

