"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Shield, Users, FileText, Activity, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/components/auth/login-form"
import { useAuth } from "@/hooks/use-auth"
import Dashboard from "@/components/dashboard/dashboard"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="text-sky-600"
        >
          <Activity size={48} />
        </motion.div>
      </div>
    )
  }

  if (user) {
    return <Dashboard />
  }

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Stethoscope className="h-8 w-8 text-sky-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800">MediKeep Africa</h1>
          </div>
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl px-6"
          >
            Login
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Digital Health Records for
              <span className="text-sky-600"> Modern Africa</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your hospital or clinic with our comprehensive digital medical record system. Secure,
              intelligent, and designed for African healthcare providers.
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-sky-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <motion.div whileHover={{ scale: 1.1 }} className="mx-auto mb-4 p-3 bg-sky-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-sky-600" />
                </motion.div>
                <CardTitle className="text-sky-800">Patient Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Comprehensive patient profiles with medical history, vitals tracking, and QR code generation for easy
                  identification.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <motion.div whileHover={{ scale: 1.1 }} className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <FileText className="h-8 w-8 text-green-600" />
                </motion.div>
                <CardTitle className="text-green-800">Smart Records</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  AI-powered medical records with symptom analysis, diagnosis suggestions, and automated documentation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <motion.div whileHover={{ scale: 1.1 }} className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-purple-600" />
                </motion.div>
                <CardTitle className="text-purple-800">Secure & Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Role-based access control, encrypted data storage, and compliance with healthcare privacy standards.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <Button
              onClick={() => setShowLogin(true)}
              size="lg"
              className="bg-gradient-to-r from-sky-600 to-green-600 hover:from-sky-700 hover:to-green-700 text-white rounded-2xl px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Everything You Need for Modern Healthcare</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From patient registration to AI-powered diagnostics, MediKeep Africa provides all the tools your
              healthcare facility needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Multi-Role Access", desc: "Admin, Doctor, Nurse, Reception roles" },
              { icon: Activity, title: "Real-time Vitals", desc: "Track and monitor patient vitals" },
              { icon: FileText, title: "Digital Records", desc: "Paperless medical documentation" },
              { icon: Shield, title: "Data Security", desc: "Encrypted and HIPAA compliant" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-sky-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Stethoscope className="h-6 w-6" />
            <span className="text-xl font-semibold">MediKeep Africa</span>
          </div>
          <p className="text-gray-400">Empowering African healthcare with digital innovation</p>
        </div>
      </footer>
    </div>
  )
}
