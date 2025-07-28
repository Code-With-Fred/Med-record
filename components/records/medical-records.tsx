"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  FileText,
  Activity,
  Brain,
  Save,
  X,
  Eye,
  Download,
  Stethoscope,
  Heart,
  Thermometer,
  Weight,
  Ruler,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  date: string
  type: "consultation" | "lab" | "imaging" | "procedure"
  symptoms: string
  diagnosis: string
  medications: string[]
  vitals: {
    temperature: string
    bloodPressure: string
    heartRate: string
    weight: string
    height: string
  }
  notes: string
  attachments: string[]
  doctorName: string
  status: "draft" | "completed" | "reviewed"
}

interface MedicalRecordsProps {
  onBack: () => void
}

export default function MedicalRecords({ onBack }: MedicalRecordsProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const [newRecord, setNewRecord] = useState({
    patientId: '',
    patientName: '',
    type: 'consultation' as const,
    symptoms: '',
    diagnosis: '',
    medications: '',
    vitals: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      weight: '',
      height: ''
    },
    notes: '',
    attachments: [] as string[]
  })

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockRecords: MedicalRecord[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'John Doe',
          date: '2024-01-20',
          type: 'consultation',
          symptoms: 'Chest pain, shortness of breath, fatigue',
          diagnosis: 'Hypertensive heart disease',
          medications: ['Lisinopril 10mg', 'Metoprolol 50mg'],
          vitals: {
            temperature: '98.6°F',
            bloodPressure: '150/95',
            heartRate: '88 bpm',
            weight: '180 lbs',
            height: '5\'10"'
          },
          notes: 'Patient reports chest discomfort for 3 days. ECG shows mild LVH. Recommend lifestyle changes and medication compliance.',
          attachments: [],
          doctorName: 'Dr. Sarah Wilson',
          status: 'completed'
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Sarah Johnson',
          date: '2024-01-18',
          type: 'lab',
          symptoms: 'Increased thirst, frequent urination, blurred vision',
          diagnosis: 'Type 2 Diabetes Mellitus - uncontrolled',
          medications: ['Metformin 1000mg', 'Glipizide 5mg'],
          vitals: {
            temperature: '98.2°F',
            bloodPressure: '135/80',
            heartRate: '76 bpm',
            weight: '165 lbs',
            height: '5\'6"'
          },
          notes: 'HbA1c: 9.2%. Fasting glucose: 280 mg/dL. Patient needs better glucose control. Referred to endocrinologist.',
          attachments: ['lab-results-hba1c.pdf'],
          doctorName: 'Dr. Michael Chen',
          status: 'reviewed'
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Michael Chen',
          date: '2024-01-15',
          type: 'consultation',
          symptoms: 'Wheezing, cough, difficulty breathing',
          diagnosis: 'Asthma exacerbation',
          medications: ['Albuterol inhaler', 'Prednisone 20mg'],
          vitals: {
            temperature: '99.1°F',
            bloodPressure: '120/75',
            heartRate: '92 bpm',
            weight: '170 lbs',
            height: '5\'8"'
          },
          notes: 'Peak flow: 60% of predicted. Administered nebulizer treatment. Patient responded well. Continue current regimen.',
          attachments: [],
          doctorName: 'Dr. Emily Rodriguez',
          status: 'completed'
        }
      ]
      setRecords(mockRecords)
      setIsLoading(false)
    }, 1000)
  }

  const generateAISuggestions = async (symptoms: string) => {
    if (!symptoms.trim()) return

    setIsGeneratingAI(true)
    try {
      const { text } = await generateText({
        model: openai('gpt-4o'),
        system: 'You are a medical AI assistant. Based on the symptoms provided, suggest 3-5 possible diagnoses. Format as a simple list, one diagnosis per line. Be conservative and always recommend professional medical evaluation.',
        prompt: `Patient presents with the following symptoms: ${symptoms}. What are the most likely diagnoses to consider?`
      })

      const suggestions = text.split('\n').filter(line => line.trim()).slice(0, 5)
      setAiSuggestions(suggestions)
      toast.success('AI suggestions generated!')
    } catch (error) {
      toast.error('Failed to generate AI suggestions')
      console.error('AI generation error:', error)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleAddRecord = async () => {
    if (!newRecord.patientName || !newRecord.symptoms) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const record: MedicalRecord = {
        id: Date.now().toString(),
        ...newRecord,
        patientId: newRecord.patientId || Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        medications: newRecord.medications.split(',').map(m => m.trim()).filter(Boolean),
        doctorName: 'Dr. Current User',
        status: 'draft'
      }

      setRecords(prev => [record, ...prev])
      setNewRecord({
        patientId: '',
        patientName: '',
        type: 'consultation',
        symptoms: '',
        diagnosis: '',
        medications: '',
        vitals: {
          temperature: '',
          bloodPressure: '',
          heartRate: '',
          weight: '',
          height: ''
        },
        notes: '',
        attachments: []
      })
      setShowAddForm(false)
      setAiSuggestions([])
      setIsLoading(false)
      toast.success('Medical record added successfully!')
    }, 1000)
  }

  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="h-4 w-4" />
      case 'lab': return <Activity className="h-4 w-4" />
      case 'imaging': return <Eye className="h-4 w-4" />
      case 'procedure': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
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
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="rounded-xl hover:bg-sky-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
                <p className="text-sm text-gray-600">Manage patient medical records and history</p>
              </div>
            </div>

            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Record
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search records by patient, diagnosis, or symptoms..."
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

        {/* Records List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
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
            className="space-y-6"
          >
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedRecord(record)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                          {getTypeIcon(record.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800">{record.patientName}</CardTitle>
                          <CardDescription className="text-sm">
                            {new Date(record.date).toLocaleDateString()} • {record.type}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Symptoms</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{record.symptoms}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Diagnosis</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">{record.diagnosis}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Thermometer className="h-4 w-4" />
                        <span>{record.vitals.temperature}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Heart className="h-4 w-4" />
                        <span>{record.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Activity className="h-4 w-4" />
                        <span>{record.vitals.heartRate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Weight className="h-4 w-4" />
                        <span>{record.vitals.weight}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-gray-500">Dr. {record.doctorName}</span>
                      <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredRecords.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No medical records found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or add a new record.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add First Record
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add Record Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">New Medical Record</DialogTitle>
            <DialogDescription>
              Create a new medical record with AI-powered assistance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-gray-700 font-medium">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={newRecord.patientName}
                  onChange={(e) => setNewRecord({ ...newRecord, patientName: e.target.value })}
                  placeholder="Enter patient name"
                  className="rounded-xl border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-700 font-medium">Record Type</Label>
                <Select value={newRecord.type} onValueChange={(value: any) => setNewRecord({ ...newRecord, type: value })}>
                  <SelectTrigger className="rounded-xl border-sky-200 focus:border-sky-400">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="lab">Lab Results</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Symptoms with AI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="symptoms" className="text-gray-700 font-medium">Symptoms *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateAISuggestions(newRecord.symptoms)}
                  disabled={isGeneratingAI || !newRecord.symptoms.trim()}
                  className="rounded-xl"
                >
                  {isGeneratingAI ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  AI Suggest
                </Button>
              </div>
              <Textarea
                id="symptoms"
                value={newRecord.symptoms}
                onChange={(e) => setNewRecord({ ...newRecord, symptoms: e.target.value })}
                placeholder="Describe patient symptoms..."
                className="rounded-xl border-sky-200 focus:border-sky-400 min-h-[100px]"
              />
              
              {aiSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Diagnostic Suggestions
                  </h4>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewRecord({ ...newRecord, diagnosis: suggestion.replace(/^\d+\.\s*/, '') })}
                        className="block w-full text-left p-2 text-sm text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    ⚠️ AI suggestions are for reference only. Always use clinical judgment.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="text-gray-700 font-medium">Diagnosis</Label>
              <Input
                id="diagnosis"
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                placeholder="Enter diagnosis"
                className="rounded-xl border-sky-200 focus:border-sky-400"
              />
            </div>

            {/* Vitals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Vital Signs</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Temperature</Label>
                  <Input
                    value={newRecord.vitals.temperature}
                    onChange={(e) => setNewRecord({ 
                      ...newRecord, 
                      vitals: { ...newRecord.vitals, temperature: e.target.value }
                    })}
                    placeholder="98.6°F"
                    className="rounded-xl border-sky-200 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Blood Pressure</Label>
                  <Input
                    value={newRecord.vitals.bloodPressure}
                    onChange={(e) => setNewRecord({ 
                      ...newRecord, 
                      vitals: { ...newRecord.vitals, bloodPressure: e.target.value }
                    })}
                    placeholder="120/80"
                    className="rounded-xl border-sky-200 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Heart Rate</Label>
                  <Input
                    value={newRecord.vitals.heartRate}
                    onChange={(e) => setNewRecord({ 
                      ...newRecord, 
                      vitals: { ...newRecord.vitals, heartRate: e.target.value }
                    })}
                    placeholder="72 bpm"
                    className="rounded-xl border-sky-200 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Weight</Label>
                  <Input
                    value={newRecord.vitals.weight}
                    onChange={(e) => setNewRecord({ 
                      ...newRecord, 
                      vitals: { ...newRecord.vitals, weight: e.target.value }
                    })}
                    placeholder="150 lbs"
                    className="rounded-xl border-sky-200 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Height</Label>
                  <Input
                    value={newRecord.vitals.height}
                    onChange={(e) => setNewRecord({ 
                      ...newRecord, 
                      vitals: { ...newRecord.vitals, height: e.target.value }
                    })}
                    placeholder="5'8\""\
                    className="rounded-xl border-sky-200 focus:border-sky-400"\
                  />
                </div>\
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications" className="text-gray-700 font-medium">Medications</Label>
              <Input
                id="medications"
                value={newRecord.medications}
                onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                placeholder="Medication 1, Medication 2 (comma separated)"
                className="rounded-xl border-sky-200 focus:border-sky-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-700 font-medium">Clinical Notes</Label>
              <Textarea
                id="notes"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                placeholder="Additional clinical notes and observations..."
                className="rounded-xl border-sky-200 focus:border-sky-400 min-h-[100px]"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setAiSuggestions([])
                }}
                className="rounded-xl"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleAddRecord}
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
                Save Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Details Dialog */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Medical Record Details</DialogTitle>
              <DialogDescription>
                Complete medical record for {selectedRecord.patientName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(selectedRecord.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedRecord.patientName}</h3>
                    <p className="text-gray-600">{new Date(selectedRecord.date).toLocaleDateString()} • {selectedRecord.type}</p>
                  </div>
                </div>
                <Badge className={`rounded-full ${getStatusColor(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedRecord.symptoms}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Diagnosis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedRecord.diagnosis}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Vital Signs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-xl">
                        <Thermometer className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Temperature</p>
                        <p className="text-lg font-bold text-red-600">{selectedRecord.vitals.temperature}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <Heart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Blood Pressure</p>
                        <p className="text-lg font-bold text-blue-600">{selectedRecord.vitals.bloodPressure}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Heart Rate</p>
                        <p className="text-lg font-bold text-green-600">{selectedRecord.vitals.heartRate}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-xl">
                        <Weight className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Weight</p>
                        <p className="text-lg font-bold text-purple-600">{selectedRecord.vitals.weight}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <Ruler className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Height</p>
                        <p className="text-lg font-bold text-orange-600">{selectedRecord.vitals.height}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedRecord.medications.length > 0 && (
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Medications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedRecord.medications.map((medication, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">{medication}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedRecord.notes}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">Recorded by: {selectedRecord.doctorName}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" className="rounded-xl bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl">
                  Edit Record
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )\
}
