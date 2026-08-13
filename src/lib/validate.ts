export function validateJourney(journey: any) {
  const errors: string[] = []
  if (!journey) {
    errors.push('Missing journey data')
    return { valid: false, errors }
  }
  const pin = journey.pin
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) errors.push('PIN must be a 4-digit numeric code')

  if (!journey.recipient_name || String(journey.recipient_name).trim().length === 0) errors.push('Recipient name is required')

  if (typeof journey.welcome_headline === 'string' && journey.welcome_headline.length > 200) errors.push('Headline must be 200 characters or less')

  if (Array.isArray(journey.wishes) && journey.wishes.some((w: any) => typeof w !== 'string' || w.length > 300)) errors.push('Each wish must be a string under 300 characters')

  return { valid: errors.length === 0, errors }
}
