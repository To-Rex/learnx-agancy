import bcrypt from 'bcryptjs'

/**
 * Parolni hash qilish
 * @param password - Oddiy parol
 * @returns Hash qilingan parol
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12 // Xavfsizlik uchun yuqori salt rounds
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Parolni tekshirish
 * @param password - Oddiy parol
 * @param hashedPassword - Hash qilingan parol
 * @returns Parol to'g'ri yoki yo'qligi
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

/**
 * Parol kuchliligini tekshirish
 * @param password - Tekshiriladigan parol
 * @returns Parol kuchliligi haqida ma'lumot
 */
export const validatePasswordStrength = (password: string) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length

  return {
    isValid: score >= 3 && password.length >= minLength,
    score,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    },
    strength: score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong'
  }
}