"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, User, Phone, Heart, AlertTriangle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import QRGenerator from "./qr-generator"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  bloodType: string
  allergies: string[]
  emergencyContact: string
  conditions: string[]
  photo?: string
  qrCode: string
  lastVisit: string
  status: "active" | "inactive"
}

interface QRPatientCardProps {
  patient: Patient
  onViewDetails: (patient: Patient) => void
}

export default function QRPatientCard({ patient, onViewDetails }: QRPatientCardProps) {
  const [showQRCode, setShowQRCode] = useState(false)

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden">
          {/* QR Code Indicator */}
          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowQRCode(true)
              }}
              className="p-2 bg-sky-100 hover:bg-sky-200 rounded-full transition-colors"
            >
              <QrCode className="h-4 w-4 text-sky-600" />
            </motion.button>
          </div>

          <CardHeader className="pb-4" onClick={() => onViewDetails(patient)}>
            <div className="flex items-start justify-between pr-12">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  {patient.photo ? (
                    <img
                      src={patient.photo || "/placeholder.svg"}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-sky-600" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-800">{patient.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {calculateAge(patient.dateOfBirth)} years old • {patient.gender}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3" onClick={() => onViewDetails(patient)}>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{patient.phone}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Heart className="h-4 w-4" />
              <span>Blood Type: {patient.bloodType}</span>
            </div>

            {patient.allergies.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Allergies: {patient.allergies.slice(0, 2).join(", ")}</span>
                {patient.allergies.length > 2 && <span>+{patient.allergies.length - 2} more</span>}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Badge variant={patient.status === "active" ? "default" : "secondary"} className="rounded-full">
                  {patient.status}
                </Badge>
                <Badge variant="outline" className="rounded-full text-xs">
                  <QrCode className="h-3 w-3 mr-1" />
                  {patient.qrCode}
                </Badge>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>
          </CardContent>

          {/* Animated QR indicator */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-2 right-2 w-2 h-2 bg-sky-500 rounded-full"
          />
        </Card>
      </motion.div>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Patient QR Code</DialogTitle>
            <DialogDescription>QR code for {patient.name} - scan for instant identification</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <QRGenerator
              patientId={patient.id}
              patientName={patient.name}
              patientData={{
                id: patient.id,
                name: patient.name,
                phone: patient.phone,
                bloodType: patient.bloodType,
                allergies: patient.allergies,
                emergencyContact: patient.emergencyContact,
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
