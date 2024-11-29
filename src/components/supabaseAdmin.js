const { createClient } = require('@supabase/supabase-js');

// Configuración del cliente de Supabase
const supabaseUrl = 'https://kwztmkddvpuikszfeuzx.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3enRta2RkdnB1aWtzemZldXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDMxMDQ4MSwiZXhwIjoyMDQ1ODg2NDgxfQ.OB0mMCM28Pyx3bnc97ddddWKHTouxu-VZdwealo2Z3U'; // Reemplaza con tu Service Role Key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
