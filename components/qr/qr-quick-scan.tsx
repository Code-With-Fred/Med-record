"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, Scan, User, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QRScanner from "./qr-scanner"
import { toast } from "react-hot-toast"

interface QRQuickScanProps {
  onPatientFound: (patientData: any) => void
}

export default function QRQuickScan({ onPatientFound }: QRQuickScanProps) {
  const [showScanner, setShowScanner] = useState(false)
  const [recentScans, setRecentScans] = useState<any[]>([])

  const handlePatientScanned = (scannedData: any) => {
    // Add to recent scans
    setRecentScans((prev) => [scannedData, ...prev.slice(0, 4)])
    onPatientFound(scannedData)
    toast.success(`Quick scan: ${scannedData.name} identified!`)
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="mx-auto w-fit mb-2"
          >
            <div className="p-3 bg-green-100 rounded-full">
              <QrCode className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>
          <CardTitle className="text-lg text-green-800">Quick QR Scan</CardTitle>
          <CardDescription className="text-green-600">Instantly identify patients with QR codes</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowScanner(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Scan className="h-5 w-5 mr-2" />
              Start QR Scan
            </Button>
          </motion.div>

          {recentScans.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                Recent Scans
              </h4>
              <div className="space-y-1">
                {recentScans.slice(0, 3).map((scan, index) => (
                  <motion.div
                    key={`${scan.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-2 p-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
                    onClick={() => onPatientFound(scan)}
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1">{scan.name}</span>
                    <span className="text-xs text-gray-500">{scan.bloodType}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">Position QR code in camera view for instant identification</p>
          </div>
        </CardContent>
      </Card>

      <QRScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onPatientScanned={handlePatientScanned} />
    </>
  )
}
