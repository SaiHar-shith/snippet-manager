import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gxswoylwuvsetgmwuavv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4c3dveWx3dXZzZXRnbXd1YXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTA5MTUsImV4cCI6MjA4MTM4NjkxNX0.Oe78RqX5SO7EoUYUnsoTuKm0LI1HvV5iFM4Dq6BP7jk'

export const supabase = createClient(supabaseUrl, supabaseKey)