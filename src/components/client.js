
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://spvmizyamqzwhykczduk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdm1penlhbXF6d2h5a2N6ZHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTk3MjgsImV4cCI6MjA0OTE5NTcyOH0.ZXD6Rs7aZXD2bp1svvB4KSHaiKQs5HV1p74PDNemO5w'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;