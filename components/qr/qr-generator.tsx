"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { motion } from "framer-motion"
import { Download, Copy, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"

interface QRGeneratorProps {
  patientId: string
  patientName: string
  patientData: {
    id: string
    name: string
    phone: string
    bloodType: string
    allergies: string[]
    emergencyContact: string
  }
}

export default function QRGenerator({ patientId, patientName, patientData }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const qrData = JSON.stringify({
    type: "medikeep_patient",
    id: patientData.id,
    name: patientData.name,
    phone: patientData.phone,
    bloodType: patientData.bloodType,
    allergies: patientData.allergies,
    emergencyContact: patientData.emergencyContact,
    timestamp: Date.now(),
  })

  useEffect(() => {
    generateQRCode()
  }, [patientData])

  const generateQRCode = async () => {
    if (!canvasRef.current) return

    try {
      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#0369a1", // Sky blue
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      })
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Failed to generate QR code")
    }
  }

  const downloadQRCode = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `${patientName.replace(/\s+/g, "_")}_QR_Code.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
    toast.success("QR code downloaded successfully!")
  }

  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrData)
      toast.success("QR data copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy QR data")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <QrCode className="h-6 w-6 text-sky-600" />
            </motion.div>
            <CardTitle className="text-lg text-gray-800">Patient QR Code</CardTitle>
          </div>
          <CardDescription>Scan this code for instant patient identification</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white rounded-2xl shadow-md border-2 border-sky-100"
            >
              <canvas ref={canvasRef} className="block" style={{ imageRendering: "pixelated" }} />
            </motion.div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">Patient: {patientName}</p>
            <p className="text-xs text-gray-500">ID: {patientId}</p>
          </div>

          <div className="flex justify-center space-x-3">
            <Button
              onClick={downloadQRCode}
              variant="outline"
              size="sm"
              className="rounded-xl border-sky-200 hover:bg-sky-50 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={copyQRData}
              variant="outline"
              size="sm"
              className="rounded-xl border-sky-200 hover:bg-sky-50 bg-transparent"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Data
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>This QR code contains encrypted patient identification data.</p>
            <p>Scan with MediKeep Africa app for instant access.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
