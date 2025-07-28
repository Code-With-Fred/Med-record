"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, X, Scan, User, Phone, Heart, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import QrScanner from "qr-scanner"

interface ScannedPatientData {
  type: string
  id: string
  name: string
  phone: string
  bloodType: string
  allergies: string[]
  emergencyContact: string
  timestamp: number
}

interface QRScannerProps {
  onPatientScanned: (patientData: ScannedPatientData) => void
  isOpen: boolean
  onClose: () => void
}

export default function QRScanner({ onPatientScanned, isOpen, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ScannedPatientData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrScannerRef = useRef<QrScanner | null>(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      startScanning()
    } else {
      stopScanning()
    }

    return () => {
      stopScanning()
    }
  }, [isOpen])

  const startScanning = async () => {
    if (!videoRef.current) return

    try {
      setIsScanning(true)
      setError(null)

      qrScannerRef.current = new QrScanner(videoRef.current, (result) => handleScanResult(result.data), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: "environment",
      })

      await qrScannerRef.current.start()
    } catch (err) {
      console.error("Error starting QR scanner:", err)
      setError("Failed to start camera. Please check permissions.")
      setIsScanning(false)
      toast.error("Camera access denied or not available")
    }
  }

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }
    setIsScanning(false)
  }

  const handleScanResult = (data: string) => {
    try {
      const parsedData = JSON.parse(data) as ScannedPatientData

      // Validate that this is a MediKeep patient QR code
      if (parsedData.type !== "medikeep_patient") {
        toast.error("Invalid QR code. Please scan a MediKeep patient QR code.")
        return
      }

      // Check if the QR code is not too old (24 hours)
      const now = Date.now()
      const qrAge = now - parsedData.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

      if (qrAge > maxAge) {
        toast.error("QR code is expired. Please generate a new one.")
        return
      }

      setScannedData(parsedData)
      stopScanning()
      toast.success("Patient QR code scanned successfully!")
    } catch (err) {
      console.error("Error parsing QR code:", err)
      toast.error("Invalid QR code format")
    }
  }

  const handleConfirmPatient = () => {
    if (scannedData) {
      onPatientScanned(scannedData)
      setScannedData(null)
      onClose()
    }
  }

  const handleClose = () => {
    stopScanning()
    setScannedData(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
            <Scan className="h-6 w-6 mr-2 text-sky-600" />
            Scan Patient QR Code
          </DialogTitle>
          <DialogDescription>Position the QR code within the camera frame to scan</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AnimatePresence mode="wait">
            {!scannedData ? (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-48 h-48 border-2 border-sky-400 rounded-2xl"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center text-white p-4">
                        <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="inline-block mb-2"
                  >
                    <Scan className="h-8 w-8 text-sky-600" />
                  </motion.div>
                  <p className="text-sm text-gray-600">
                    {isScanning ? "Scanning for QR code..." : "Initializing camera..."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-green-50 border-green-200 rounded-2xl">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="mx-auto w-fit mb-2"
                    >
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </motion.div>
                    <CardTitle className="text-lg text-green-800">Patient Identified</CardTitle>
                    <CardDescription className="text-green-600">QR code scanned successfully</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{scannedData.name}</h3>
                      <p className="text-sm text-gray-600">Patient ID: {scannedData.id}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-xl">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{scannedData.phone}</span>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-white rounded-xl">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-700">Blood Type: {scannedData.bloodType}</span>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-white rounded-xl">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Emergency: {scannedData.emergencyContact}</span>
                      </div>

                      {scannedData.allergies.length > 0 && (
                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Allergies</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {scannedData.allergies.map((allergy, index) => (
                              <Badge key={index} variant="destructive" className="text-xs rounded-full">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setScannedData(null)}
                        className="flex-1 rounded-xl bg-transparent"
                      >
                        Scan Again
                      </Button>
                      <Button
                        onClick={handleConfirmPatient}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      >
                        Confirm Patient
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Close Scanner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
