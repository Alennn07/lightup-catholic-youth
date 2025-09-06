// Email domain validation utility
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com'
]

export function validateEmailDomain(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }

  // Extract domain after @
  const emailParts = email.split('@')
  if (emailParts.length !== 2) {
    return { isValid: false, error: 'Invalid email format' }
  }

  const domain = emailParts[1].toLowerCase().trim()
  
  // Check if domain is in allowlist
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return { 
      isValid: false, 
      error: 'Only Gmail, Yahoo, Outlook, Hotmail, or iCloud verified accounts are allowed.' 
    }
  }

  return { isValid: true }
}

export function getEmailDomain(email: string): string | null {
  if (!email || typeof email !== 'string') return null
  
  const emailParts = email.split('@')
  if (emailParts.length !== 2) return null
  
  return emailParts[1].toLowerCase().trim()
}

export { ALLOWED_EMAIL_DOMAINS }
