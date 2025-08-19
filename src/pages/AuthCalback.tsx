import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase sessiyani olish
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error("Session error:", error);
        return;
      }

      const supabaseToken = data.session.access_token;
      console.log("Supabase Google token:", supabaseToken);

      // Supabase tokenni localStorage ga saqlash
      localStorage.setItem('supabase_token', supabaseToken);

      try {
        // API ga yuborish
        const res = await fetch(
          'https://learnx-crm-production.up.railway.app/api/v1/auth/login-with-supabase',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseToken}`,
            },
            body: JSON.stringify({ access_token: supabaseToken }),
          }
        );

        if (!res.ok) {
          throw new Error(`API xatolik: ${res.status}`);
        }

        const apiData = await res.json();

        // API tokenni localStorage ga saqlash
        if (apiData.token) {
          localStorage.setItem('api_access_token', apiData.token);
        }
        if (apiData.client.id) {
          console.log('client_id', apiData?.client?.id);
          localStorage.setItem('client_id', apiData?.client?.id);
        }

        // Foydalanuvchini profil sahifasiga yo‘naltirish
        navigate("/profile");

      } catch (err) {
        console.error("API bilan ishlashda xato:", err);
      }
    };

    handleAuth();
  }, [navigate]);

  return <p>Google orqali kirilmoqda...</p>;
}
