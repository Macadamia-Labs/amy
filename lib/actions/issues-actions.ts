import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Issue {
  id?: string // UUID, optional for new entries
  created_at?: string // Timestamp, optional for new entries
  resource_id: string // UUID
  implementation_steps: any // JSONB
  user_id: string // UUID
  severity: string // Text
  category: string // Text
  impact: string // Text
  overall_assessment: string // Text
  issue: string // Text
  resolution: string // Text
  estimated_impact: string // Text
}

export async function saveIssuesToSupabase(issues: Issue[]) {
  const transformedIssues = issues.map(issue => ({
    resource_id: issue.resource_id,
    implementation_steps: issue.implementation_steps,
    user_id: issue.user_id,
    severity: issue.severity,
    category: issue.category,
    impact: issue.impact,
    overall_assessment: issue.overall_assessment,
    issue: issue.issue,
    resolution: issue.resolution,
    estimated_impact: issue.estimated_impact
  }))

  const { data, error } = await supabase
    .from('issues')
    .insert(transformedIssues)

  if (error) {
    console.error('Error saving issues:', error)
    throw new Error('Failed to save issues')
  }

  return data
}
