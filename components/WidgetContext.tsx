"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface WidgetFilters {
  subjectFilter?: string
  dateFilter?: {
    start: string
    end: string
  }
}

interface WidgetContextType {
  filters: WidgetFilters
  setSubjectFilter: (subject: string | undefined) => void
  setDateFilter: (dateFilter: { start: string; end: string } | undefined) => void
  clearFilters: () => void
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined)

export const useWidgetFilters = () => {
  const context = useContext(WidgetContext)
  if (context === undefined) {
    throw new Error('useWidgetFilters must be used within a WidgetProvider')
  }
  return context
}

interface WidgetProviderProps {
  children: ReactNode
}

export const WidgetProvider: React.FC<WidgetProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<WidgetFilters>({})

  const setSubjectFilter = (subject: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      subjectFilter: subject
    }))
  }

  const setDateFilter = (dateFilter: { start: string; end: string } | undefined) => {
    setFilters(prev => ({
      ...prev,
      dateFilter
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  return (
    <WidgetContext.Provider value={{
      filters,
      setSubjectFilter,
      setDateFilter,
      clearFilters
    }}>
      {children}
    </WidgetContext.Provider>
  )
}