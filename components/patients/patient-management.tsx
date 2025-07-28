"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  Heart,
  AlertTriangle,
  QrCode,
  Save,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import QRScanner from "@/components/qr/qr-scanner"
import QRPatientCard from "@/components/qr/qr-patient-card"

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

interface PatientManagementProps {
  onBack: () => void
}

export default function PatientManagement({ onBack }: PatientManagementProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)

  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    allergies: "",
    emergencyContact: "",
    conditions: "",
    photo: "",
  })

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockPatients: Patient[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+234 801 234 5678",
          dateOfBirth: "1985-06-15",
          gender: "Male",
          bloodType: "O+",
          allergies: ["Penicillin", "Peanuts"],
          emergencyContact: "+234 802 345 6789",
          conditions: ["Hypertension"],
          qrCode: "QR001",
          lastVisit: "2024-01-15",
          status: "active",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          phone: "+234 803 456 7890",
          dateOfBirth: "1992-03-22",
          gender: "Female",
          bloodType: "A+",
          allergies: ["Latex"],
          emergencyContact: "+234 804 567 8901",
          conditions: ["Diabetes Type 2"],
          qrCode: "QR002",
          lastVisit: "2024-01-20",
          status: "active",
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "michael.chen@email.com",
          phone: "+234 805 678 9012",
          dateOfBirth: "1978-11-08",
          gender: "Male",
          bloodType: "B-",
          allergies: [],
          emergencyContact: "+234 806 789 0123",
          conditions: ["Asthma"],
          qrCode: "QR003",
          lastVisit: "2024-01-18",
          status: "active",
        },
      ]
      setPatients(mockPatients)
      setIsLoading(false)
    }, 1000)
  }

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.phone || !newPatient.dateOfBirth) {
      toast.error("Please fill in required fields")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const patient: Patient = {
        id: Date.now().toString(),
        ...newPatient,
        allergies: newPatient.allergies
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        conditions: newPatient.conditions
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        qrCode: `QR${Date.now()}`,
        lastVisit: new Date().toISOString().split("T")[0],
        status: "active",
      }

      setPatients((prev) => [patient, ...prev])
      setNewPatient({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        bloodType: "",
        allergies: "",
        emergencyContact: "",
        conditions: "",
        photo: "",
      })
      setShowAddForm(false)
      setIsLoading(false)
      toast.success("Patient added successfully!")
    }, 1000)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const handlePatientScanned = (scannedData: any) => {
    // Find patient in the list or create a new entry
    const existingPatient = patients.find((p) => p.id === scannedData.id)
    if (existingPatient) {
      setSelectedPatient(existingPatient)
      toast.success(`Patient ${scannedData.name} found!`)
    } else {
      toast.error("Patient not found in system. Please register first.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={onBack} variant="ghost" size="sm" className="rounded-xl hover:bg-sky-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
                <p className="text-sm text-gray-600">Manage patient profiles and information</p>
              </div>
            </div>

            <Button onClick={() => setShowAddForm(true)} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
            <Button
              onClick={() => setShowQRScanner(true)}
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl border-green-600"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <Card className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-sky-200 focus:border-sky-400"
                  />
                </div>
                <Button variant="outline" className="rounded-xl border-sky-200 hover:bg-sky-50 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patients Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPatients.map((patient, index) => (
              <QRPatientCard key={patient.id} patient={patient} onViewDetails={setSelectedPatient} />
            ))}
          </motion.div>
        )}

        {filteredPatients.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or add a new patient.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add First Patient
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add New Patient</DialogTitle>
            <DialogDescription>Enter patient information to create a new medical record.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="Enter full name"
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  placeholder="+234 801 234 5678"
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  placeholder="patient@email.com"
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newPatient.dateOfBirth}
                  onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-700 font-medium">
                  Gender
                </Label>
                <Select
                  value={newPatient.gender}
                  onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                >
                  <SelectTrigger className="rounded-xl border-sky-200 focus:border-sky-400">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType" className="text-gray-700 font-medium">
                  Blood Type
                </Label>
                <Select
                  value={newPatient.bloodType}
                  onValueChange={(value) => setNewPatient({ ...newPatient, bloodType: value })}
                >
                  <SelectTrigger className="rounded-xl border-sky-200 focus:border-sky-400">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergencyContact" className="text-gray-700 font-medium">
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  value={newPatient.emergencyContact}
                  onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                  placeholder="+234 802 345 6789"
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allergies" className="text-gray-700 font-medium">
                  Allergies
                </Label>
                <Input
                  id="allergies"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  placeholder="Penicillin, Peanuts (comma separated)"
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="conditions" className="text-gray-700 font-medium">
                  Medical Conditions
                </Label>
                <Input
                  id="conditions"
                  value={newPatient.conditions}
                  onChange={(e) => setNewPatient({ ...newPatient, conditions: e.target.value })}
                  placeholder="Hypertension, Diabetes (comma separated)"
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="rounded-xl">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleAddPatient}
                disabled={isLoading}
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Add Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Patient Details</DialogTitle>
              <DialogDescription>Complete information for {selectedPatient.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4 p-4 bg-sky-50 rounded-2xl">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
                  {selectedPatient.photo ? (
                    <img
                      src={selectedPatient.photo || "/placeholder.svg"}
                      alt={selectedPatient.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-sky-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h3>
                  <p className="text-gray-600">
                    {calculateAge(selectedPatient.dateOfBirth)} years old • {selectedPatient.gender}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="rounded-full">
                      <QrCode className="h-3 w-3 mr-1" />
                      {selectedPatient.qrCode}
                    </Badge>
                    <Badge
                      variant={selectedPatient.status === "active" ? "default" : "secondary"}
                      className="rounded-full"
                    >
                      {selectedPatient.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>Emergency: {selectedPatient.emergencyContact}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Blood Type: {selectedPatient.bloodType}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Last Visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {selectedPatient.allergies.length > 0 && (
                  <Card className="rounded-2xl border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-700 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Allergies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="rounded-full">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedPatient.conditions.length > 0 && (
                  <Card className="rounded-2xl border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-700">Medical Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="rounded-full">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" className="rounded-xl bg-transparent">
                  Edit Patient
                </Button>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl">View Medical Records</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onPatientScanned={handlePatientScanned}
      />
    </div>
  )
}
