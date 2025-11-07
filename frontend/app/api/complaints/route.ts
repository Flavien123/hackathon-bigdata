import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { complaint_text, route_number_qr, bus_number_qr, latitude, longitude } = body

    if (!complaint_text || !complaint_text.trim()) {
      return NextResponse.json({ error: "Текст жалобы обязателен для заполнения" }, { status: 400 })
    }

    // Here you would typically save to database or send to external API
    console.log("[v0] Received complaint:", {
      complaint_text,
      route_number_qr: route_number_qr || null,
      bus_number_qr: bus_number_qr || null,
      latitude: latitude || null,
      longitude: longitude || null,
    })

    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(
      {
        success: true,
        message: "Жалоба успешно отправлена",
        id: Math.random().toString(36).substring(7),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error processing complaint:", error)
    return NextResponse.json({ error: "Ошибка при обработке жалобы" }, { status: 500 })
  }
}
