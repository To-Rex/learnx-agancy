import { toast } from 'react-toastify';
import { SupabaseClient } from '@supabase/supabase-js';

interface Partner {
  id: string;
  name: string;
  logo: string;
}

interface PartnerForm {
  name: string;
  logo: string;
}

const uploadLogo = async (supabase: SupabaseClient, file: File): Promise<string | null> => {
  try {
    if (!file) throw new Error('Fayl tanlanmadi');
    if (!['image/png', 'image/jpeg'].includes(file.type)) throw new Error('Faqat PNG yoki JPG rasm tanlang');
    if (file.size > 5 * 1024 * 1024) throw new Error('Rasm hajmi 5MB dan oshmasligi kerak');

    const fileName = `logos/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('partner-logos').upload(fileName, file);
    if (error) throw error;

    const { data } = supabase.storage.from('partner-logos').getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err: any) {
    toast.error(err.message || 'Rasm yuklashda xatolik');
    return null;
  }
};


const addPartner = async (
  supabase: SupabaseClient,
  partnerForm: PartnerForm,
  file: File | null,
  closeModal: () => void,
  loadData: () => Promise<void>
): Promise<Partner | null> => {
  try {
    if (!partnerForm.name.trim()) {
      toast.error('Nomi kiritilishi shart');
      return null;
    }
    if (!file) {
      toast.error('Rasm tanlanishi shart');
      return null;
    }

    const logoUrl = await uploadLogo(supabase, file);
    if (!logoUrl) return null;

    const { data, error } = await supabase
      .from('partners')
      .insert({ name: partnerForm.name.trim(), logo: logoUrl })
      .select()
      .single();

    if (error) throw error;

    toast.success('Yangi hamkor qo‘shildi');
    closeModal();
    await loadData();
    return data as Partner;
  } catch (err: any) {
    toast.error(err.message || 'Hamkor qo‘shishda xatolik');
    return null;
  }
};

const editPartner = async (
  supabase: SupabaseClient,
  partnerForm: PartnerForm,
  file: File | null,
  editingItem: Partner | null,
  closeModal: () => void,
  loadData: () => Promise<void>
): Promise<Partner | null> => {
  try {
    if (!editingItem?.id) {
      toast.error('Tahrirlash uchun hamkor tanlanmadi');
      return null;
    }
    if (!partnerForm.name.trim()) {
      toast.error('Nomi kiritilishi shart');
      return null;
    }

    let logoUrl = partnerForm.logo;
    if (file) {
      const uploaded = await uploadLogo(supabase, file);
      if (!uploaded) return null;
      logoUrl = uploaded;
    }

    const { data, error } = await supabase
      .from('partners')
      .update({ name: partnerForm.name.trim(), logo: logoUrl })
      .eq('id', editingItem.id)
      .select()
      .single();

    if (error) throw error;

    toast.success('Hamkor yangilandi');
    closeModal();
    await loadData();
    return data as Partner;
  } catch (err: any) {
    toast.error(err.message || 'Hamkorni yangilashda xatolik');
    return null;
  }
};

const deletePartner = async (
  supabase: SupabaseClient,
  partnerId: string,
  loadData: () => Promise<void>
) => {
  try {
    if (!partnerId) {
      toast.error('O‘chirish uchun hamkor tanlanmadi');
      return;
    }

    const { error } = await supabase.from('partners').delete().eq('id', partnerId);
    if (error) throw error;

    toast.success('Hamkor o‘chirildi');
    await loadData();
  } catch (err: any) {
    toast.error(err.message || 'Hamkorni o‘chirishda xatolik');
  }
};

export { addPartner, editPartner, deletePartner };
