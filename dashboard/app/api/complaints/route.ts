import { NextResponse } from "next/server"
import { Pool } from "pg"

// Типы данных
interface Complaint {
  route_number: string
  bus_number: string
  latitude?: number
  longitude?: number
  location: string
  category: string
  level: string
  advice: string
  text: string
  time: string
}

// Пример данных (замените на реальное подключение к PostgreSQL)
const mockComplaints: Complaint[] = [
  {
    route_number: "12",
    bus_number: "-1",
    location: "Байтерек",
    category: "delay",
    level: "high",
    advice: "Please report delays to the transport authority to improve service.",
    text: 'Автобус маршрута 12 не пришел вовремя на остановку "Байтерек". Я ждал его 35 минут вместо положенных 15.',
    time: "07:55",
  },
  {
    route_number: "12",
    bus_number: "10051",
    latitude: 51.1309,
    longitude: 71.4552,
    location: "Нұрлы Жол",
    category: "safety_issue",
    level: "high",
    advice: "The situation has been addressed with the driver and dispatcher.",
    text: "Есіктер толық жабылмай, автобус қозғалды",
    time: "07:30",
  },
  {
    route_number: "5",
    bus_number: "10023",
    location: "Центральный рынок",
    category: "cleanliness",
    level: "medium",
    advice: "We will increase cleaning frequency.",
    text: "Автобус очень грязный, сиденья в пятнах",
    time: "09:15",
  },
  {
    route_number: "18",
    bus_number: "10067",
    location: "Кунаева",
    category: "driver_behavior",
    level: "high",
    advice: "Driver will receive additional training.",
    text: "Водитель грубо разговаривает с пассажирами",
    time: "10:30",
  },
  {
    route_number: "5",
    bus_number: "10024",
    location: "Абай",
    category: "delay",
    level: "medium",
    advice: "Please report delays to the transport authority.",
    text: "Опоздание на 20 минут",
    time: "11:00",
  },
  {
    route_number: "12",
    bus_number: "10052",
    location: "Республика",
    category: "overcrowding",
    level: "medium",
    advice: "We will add more buses during peak hours.",
    text: "Автобус переполнен, невозможно войти",
    time: "08:00",
  },
  {
    route_number: "18",
    bus_number: "10068",
    location: "Сарыарка",
    category: "technical_issue",
    level: "high",
    advice: "Bus will undergo immediate maintenance.",
    text: "Кондиционер не работает, очень жарко",
    time: "14:00",
  },
  {
    route_number: "5",
    bus_number: "10025",
    location: "Достык",
    category: "delay",
    level: "low",
    advice: "Minor delays are being addressed.",
    text: "Небольшая задержка 5 минут",
    time: "15:30",
  },
]

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL

    if (databaseUrl) {
      const pool = new Pool({
        connectionString: databaseUrl,
      })

      const result = await pool.query(`
        SELECT 
          route_number,
          bus_number,
          latitude,
          longitude,
          location,
          category,
          level,
          advice,
          text,
          time
        FROM complaints 
        ORDER BY timestamp DESC
      `)

      return NextResponse.json(result.rows)
    }

    // Имитация задержки сети для демонстрации
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json(mockComplaints)
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 })
  }
}
