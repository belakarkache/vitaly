import type { Session } from '@supabase/supabase-js'
import { ref } from 'vue'
import { supabase } from '@/supabase'

export const session = ref<Session | null>(null)

let started = false
export async function initAuth() {
  if (started) return
  started = true

  const { data } = await supabase.auth.getSession()
  session.value = data.session

  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
  })
}
