"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Heart,
  Stethoscope,
  LogOut,
  QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import PatientManagement from "@/components/patients/patient-management"
import MedicalRecords from "@/components/records/medical-records"
import { toast } from "react-hot-toast"
import QRScanner from "@/components/qr/qr-scanner"
import QRQuickScan from "@/components/qr/qr-quick-scan"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingResults: 0,
    activeStaff: 0,
  })
  const [showQRScanner, setShowQRScanner] = useState(false)

  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      // In a real app, this would fetch from your API
      setStats({
        totalPatients: 1247,
        todayAppointments: 23,
        pendingResults: 8,
        activeStaff: 15,
      })
    }
    loadStats()
  }, [])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  const handlePatientScanned = (scannedData: any) => {
    toast.success(`Patient ${scannedData.name} identified via QR code!`)
    // You can add logic here to navigate to patient details or records
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity, roles: ["admin", "doctor", "nurse", "reception"] },
    { id: "patients", label: "Patients", icon: Users, roles: ["admin", "doctor", "nurse", "reception"] },
    { id: "records", label: "Medical Records", icon: FileText, roles: ["admin", "doctor", "nurse"] },
    { id: "appointments", label: "Appointments", icon: Calendar, roles: ["admin", "doctor", "nurse", "reception"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || ""))

  if (activeTab === "patients") {
    return <PatientManagement onBack={() => setActiveTab("dashboard")} />
  }

  if (activeTab === "records") {
    return <MedicalRecords onBack={() => setActiveTab("dashboard")} />
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
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Stethoscope className="h-8 w-8 text-sky-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MediKeep Africa</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name || "User"} ({user?.role})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  className="pl-10 w-64 rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <Button
                onClick={() => setShowQRScanner(true)}
                variant="ghost"
                size="sm"
                className="rounded-xl hover:bg-green-50 text-green-600"
              >
                <QrCode className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="sm" className="relative rounded-xl">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">3</Badge>
              </Button>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="rounded-xl hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mb-8">
          <div className="flex space-x-2 bg-white/70 backdrop-blur-sm p-2 rounded-2xl shadow-sm w-fit">
            {filteredMenuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => setActiveTab(item.id)}
                className={`rounded-xl px-4 py-2 transition-all duration-300 ${
                  activeTab === item.id ? "bg-sky-600 text-white shadow-md" : "hover:bg-sky-50 text-gray-600"
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Total Patients</CardTitle>
                    <Users className="h-5 w-5 opacity-80" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalPatients.toLocaleString()}</div>
                  <div className="flex items-center mt-2 text-sm opacity-90">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Today's Appointments</CardTitle>
                    <Calendar className="h-5 w-5 opacity-80" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.todayAppointments}</div>
                  <div className="flex items-center mt-2 text-sm opacity-90">
                    <Activity className="h-4 w-4 mr-1" />5 completed, 18 pending
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Pending Results</CardTitle>
                    <FileText className="h-5 w-5 opacity-80" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.pendingResults}</div>
                  <div className="flex items-center mt-2 text-sm opacity-90">
                    <Bell className="h-4 w-4 mr-1" />
                    Requires attention
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Active Staff</CardTitle>
                    <Heart className="h-5 w-5 opacity-80" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activeStaff}</div>
                  <div className="flex items-center mt-2 text-sm opacity-90">
                    <Users className="h-4 w-4 mr-1" />
                    On duty today
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800">Quick Actions</CardTitle>
                  <CardDescription>Common tasks for your role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => setActiveTab("patients")}
                        className="h-20 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-2xl flex-col space-y-2 border-2 border-sky-200 hover:border-sky-300"
                        variant="ghost"
                      >
                        <Plus className="h-6 w-6" />
                        <span className="text-sm font-medium">Add Patient</span>
                      </Button>

                      <Button
                        onClick={() => setActiveTab("records")}
                        className="h-20 bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl flex-col space-y-2 border-2 border-green-200 hover:border-green-300"
                        variant="ghost"
                      >
                        <FileText className="h-6 w-6" />
                        <span className="text-sm font-medium">New Record</span>
                      </Button>

                      <Button
                        onClick={() => setActiveTab("appointments")}
                        className="h-20 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-2xl flex-col space-y-2 border-2 border-purple-200 hover:border-purple-300"
                        variant="ghost"
                      >
                        <Calendar className="h-6 w-6" />
                        <span className="text-sm font-medium">Schedule</span>
                      </Button>

                      <Button
                        className="h-20 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-2xl flex-col space-y-2 border-2 border-orange-200 hover:border-orange-300"
                        variant="ghost"
                      >
                        <Activity className="h-6 w-6" />
                        <span className="text-sm font-medium">Vitals</span>
                      </Button>
                    </div>

                    <div className="md:col-span-2 lg:col-span-1">
                      <QRQuickScan
                        onPatientFound={(data) => {
                          toast.success(`Patient ${data.name} identified!`)
                          setActiveTab("patients")
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800">Recent Activity</CardTitle>
                  <CardDescription>Latest updates and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "patient",
                        message: "New patient John Doe registered",
                        time: "5 minutes ago",
                        color: "sky",
                      },
                      {
                        type: "record",
                        message: "Lab results uploaded for Sarah Johnson",
                        time: "15 minutes ago",
                        color: "green",
                      },
                      {
                        type: "appointment",
                        message: "Appointment scheduled for tomorrow",
                        time: "1 hour ago",
                        color: "purple",
                      },
                      {
                        type: "vital",
                        message: "Critical vitals alert for Patient #1234",
                        time: "2 hours ago",
                        color: "red",
                      },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className={`w-3 h-3 rounded-full bg-${activity.color}-500`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
      {/* QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onPatientScanned={handlePatientScanned}
      />
    </div>
  )
}
