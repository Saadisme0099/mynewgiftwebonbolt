import { create } from 'zustand'
import { JourneyData, defaultJourney } from './types'
import { supabase } from './supabase'

interface JourneyStore {
  journey: JourneyData
  savedId: string | null
  isSaving: boolean
  lastSavedAt: string | null
  update: <K extends keyof JourneyData>(key: K, value: JourneyData[K]) => void
  updateMany: (partial: Partial<JourneyData>) => void
  reset: () => void
  save: () => Promise<string | null>
  load: (id: string) => Promise<boolean>
  loadAll: () => Promise<JourneyData[]>
  remove: (id: string) => Promise<boolean>
}

export const useJourneyStore = create<JourneyStore>((set, get) => ({
  journey: { ...defaultJourney },
  savedId: null,
  isSaving: false,
  lastSavedAt: null,

  update: (key, value) =>
    set((state) => ({ journey: { ...state.journey, [key]: value } })),

  updateMany: (partial) =>
    set((state) => ({ journey: { ...state.journey, ...partial } })),

  reset: () => set({ journey: { ...defaultJourney }, savedId: null, lastSavedAt: null }),

  save: async () => {
    const { journey, savedId } = get()
    set({ isSaving: true })
    try {
      const payload = { ...journey }
      if (savedId) {
        const { error } = await supabase
          .from('journeys')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', savedId)
        if (error) throw error
        set({ isSaving: false, lastSavedAt: new Date().toISOString() })
        return savedId
      } else {
        const { data, error } = await supabase
          .from('journeys')
          .insert({ ...payload, published: true })
          .select('id')
          .single()
        if (error) throw error
        set({ savedId: data.id, isSaving: false, lastSavedAt: new Date().toISOString() })
        return data.id as string
      }
    } catch (err) {
      console.error('Save error:', err)
      set({ isSaving: false })
      return null
    }
  },

  load: async (id) => {
    const { data, error } = await supabase
      .from('journeys')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error || !data) return false
    set({ journey: data as JourneyData, savedId: id })
    return true
  },

  loadAll: async () => {
    const { data, error } = await supabase
      .from('journeys')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data) return []
    return data as JourneyData[]
  },

  remove: async (id) => {
    const { error } = await supabase.from('journeys').delete().eq('id', id)
    if (error) return false
    return true
  },
}))
