
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kwztmkddvpuikszfeuzx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3enRta2RkdnB1aWtzemZldXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMTA0ODEsImV4cCI6MjA0NTg4NjQ4MX0.vEwCoznl4PJshtjBrV2qYz-I8rM_JpQGzkDsDm_km5Y'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;