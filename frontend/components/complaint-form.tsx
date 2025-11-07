"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, QrCode, CheckCircle2, MapPin, Loader2 } from "lucide-react"
import QRScanner from "@/components/qr-scanner"
import { useLocale } from "@/contexts/locale-provider"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

interface BusQRData {
  routeNumber: string
  busNumber: number
}

export default function ComplaintForm() {
  const { t } = useLocale()
  const [complaint, setComplaint] = useState("")
  const [busData, setBusData] = useState<string | null>(null)
  const [parsedBusData, setParsedBusData] = useState<BusQRData | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 300)
      }
    }

    document.addEventListener("focusin", handleFocus)
    return () => document.removeEventListener("focusin", handleFocus)
  }, [])

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t.locationNotSupported)
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLocationLoading(false)
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      },
      (error) => {
        let errorMessage = t.locationError
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t.locationDenied
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = t.locationUnavailable
            break
          case error.TIMEOUT:
            errorMessage = t.locationTimeout
            break
        }
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const parseQRData = (qrString: string): BusQRData | null => {
    try {
      const data = JSON.parse(qrString)
      if (data.route_number && data.bus_number) {
        return {
          routeNumber: String(data.route_number),
          busNumber: Number(data.bus_number),
        }
      }
    } catch {
      const match = qrString.match(/(\d+).*?(\d+)/)
      if (match && match[1] && match[2]) {
        return {
          routeNumber: match[1],
          busNumber: Number(match[2]),
        }
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!complaint.trim()) {
      setSubmitError(t.enterComplaint)
      return
    }

    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const endpoint = `${apiUrl}/api/complaints`

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaint_text: complaint,
          route_number_qr: parsedBusData?.routeNumber || "",
          bus_number_qr: parsedBusData?.busNumber || 0,
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t.submitError)
      }

      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
        setComplaint("")
        setBusData(null)
        setParsedBusData(null)
        setLocation(null)
        setLocationError(null)
        setSubmitError(null)
      }, 3000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t.submitFailed)
    } finally {
      setSubmitting(false)
    }
  }

  const handleQRScan = (data: string) => {
    setBusData(data)
    const parsed = parseQRData(data)
    setParsedBusData(parsed)
    setShowScanner(false)
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-safe pb-safe">
      <div className="mb-6 mt-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <AlertCircle className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mb-1.5 text-balance text-2xl font-bold tracking-tight text-foreground">{t.appTitle}</h1>
        <p className="text-pretty text-sm text-muted-foreground">{t.appDescription}</p>
      </div>

      {submitted ? (
        <Card className="animate-in fade-in zoom-in-95 border-primary/20 bg-primary/5 duration-300">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h3 className="mb-1 text-lg font-semibold text-foreground">{t.complaintSent}</h3>
              <p className="text-sm text-muted-foreground">{t.thankYou}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pb-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">{t.problemDescription}</CardTitle>
              <CardDescription className="text-xs">{t.describeDetail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="complaint" className="text-sm font-medium text-foreground">
                  {t.yourComplaint} <span className="text-destructive">{t.required}</span>
                </Label>
                <div className="mb-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{t.exampleComplaints}:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {t.examples.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setComplaint(example)
                          if (navigator.vibrate) {
                            navigator.vibrate(30)
                          }
                        }}
                        className="group relative overflow-hidden rounded-lg border border-border/60 bg-card px-3 py-2.5 text-left text-sm text-foreground/90 shadow-sm transition-all hover:border-primary/40 hover:bg-accent hover:text-foreground hover:shadow active:scale-[0.98]"
                      >
                        <span className="relative z-10">{example}</span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary/5 to-transparent transition-transform group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  ref={textareaRef}
                  id="complaint"
                  placeholder={t.complaintPlaceholder}
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="min-h-32 resize-none text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  {t.busData} <span className="text-xs text-muted-foreground">{t.optional}</span>
                </Label>
                {busData ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3.5">
                      <div className="flex items-center gap-2.5">
                        <QrCode className="h-5 w-5 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{busData}</span>
                          {parsedBusData && (
                            <span className="text-xs text-muted-foreground">
                              {t.route}: {parsedBusData.routeNumber}, {t.bus}: {parsedBusData.busNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBusData(null)
                          setParsedBusData(null)
                        }}
                        className="text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                      >
                        {t.change}
                      </Button>
                    </div>
                    {!parsedBusData && <p className="text-xs text-destructive">{t.qrParseError}</p>}
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent active:scale-[0.98] transition-transform"
                    onClick={() => setShowScanner(true)}
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    {t.scanQR}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  {t.location} <span className="text-xs text-muted-foreground">{t.optional}</span>
                </Label>
                {location ? (
                  <div className="rounded-lg border border-border bg-muted/50 p-3.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground">
                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.accuracy}: {Math.round(location.accuracy)} {t.meters}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation(null)}
                        className="text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                      >
                        {t.remove}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent active:scale-[0.98] transition-transform"
                      onClick={getLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t.determining}
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-5 w-5" />
                          {t.getLocation}
                        </>
                      )}
                    </Button>
                    {locationError && <p className="text-xs text-destructive">{locationError}</p>}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {submitError && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="py-3">
                <p className="text-sm text-destructive">{submitError}</p>
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            className="w-full active:scale-[0.98] transition-transform shadow-sm"
            size="lg"
            disabled={!complaint.trim() || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.submitting}
              </>
            ) : (
              t.submitComplaint
            )}
          </Button>
        </form>
      )}

      {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}
    </div>
  )
}
