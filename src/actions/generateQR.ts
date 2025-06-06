'use server'

import toPromptPayQR from 'promptpay-qr'
import QRCode from 'qrcode'

export async function generateQR(formData: FormData) {
  const mobile = formData.get('mobile')?.toString() || ''
  const amountStr = formData.get('amount')?.toString() || ''
  const amount = parseFloat(amountStr)

  // Validate mobile number
  const phoneRegex = /^0[689]\d{8}$/
  if (!phoneRegex.test(mobile)) {
    throw new Error('Invalid Thai mobile number.')
  }

  // Validate amount
  if (amountStr && (isNaN(amount) || amount <= 0 || amount > 10000)) {
    throw new Error('Amount must be a number between 0 and 10,000.')
  }

  const payload = toPromptPayQR(mobile, { amount: amount || undefined })
  const qr = await QRCode.toDataURL(payload)

  return qr
}
