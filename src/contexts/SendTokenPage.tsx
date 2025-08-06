import { supabase } from '../lib/supabase'

const SendTokenPage = () => {
  const handleSendToken = () => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Session olishda xatolik:', error)
        return
      }

      const accessToken = data?.session?.access_token

      if (!accessToken) {
        console.log("Access token topilmadi")
        return
      }

      // So‘rovni yuborish
      fetch('https://your-backend.com/api/protected-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, 
        },
        body: JSON.stringify({
          message: 'Token bilan so‘rov yuborildi',
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Xatolik: ${response.status}`)
          }
          return response.json()
        })
        .then((responseData) => {
          console.log('Backenddan javob:', responseData)
        })
        .catch((err) => {
          console.error('So‘rov xatosi:', err)
        })
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Token yuborish sahifasi</h1>
      <button
        onClick={handleSendToken}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Access tokenni yuborish
      </button>
    </div>
  )
}

export default SendTokenPage
