
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🔨 Create user function called')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { name, email, role, companyId, isSystemAdmin = false } = await req.json()
    console.log('📝 Creating user:', { name, email, role, companyId, isSystemAdmin })

    const temporaryPassword = Math.random().toString(36).slice(-12) + 'Aa1!'
    console.log('🔑 Generated temporary password')

    // Create user in Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        name: name,
        role: role,
        is_system_admin: isSystemAdmin
      }
    })

    if (createError) {
      console.log('❌ Create user error:', createError)
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!newUser.user) {
      console.log('❌ No user returned from creation')
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Auth user created:', newUser.user.id)

    // Create user-company association if companyId is provided
    if (companyId) {
      const { error: associationError } = await supabaseAdmin
        .from('user_company_associations')
        .insert({
          user_id: newUser.user.id,
          company_id: companyId,
          role: role,
          is_active: true
        })

      if (associationError) {
        console.log('❌ Error creating company association:', associationError)
      } else {
        console.log('✅ Company association created')
        
        // Create user session for the company
        const { error: sessionError } = await supabaseAdmin
          .from('user_sessions')
          .insert({
            user_id: newUser.user.id,
            active_company_id: companyId
          })

        if (sessionError) {
          console.log('❌ Error creating user session:', sessionError)
        } else {
          console.log('✅ User session created')
        }
      }
    }

    console.log('✅ User created successfully:', newUser.user.id)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        temporaryPassword,
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          name
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.log('💥 Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
