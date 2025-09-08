import { motion } from 'framer-motion'
import { Eye, Mail, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
interface contactType {
  id: string;
  name: string;
  phone: number;
  email: string;
  message: string;
  created_at: number;
}
const AdminContact = () => {
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState([])
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  // Contact get 
  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://learnx-crm-production.up.railway.app/api/v1/contact-msgs/get-list')
      if (!res.ok) throw new Error('API xatolik')
      const data = await res.json()
      const formatted = data.map((item: any) => ({
        ...item,
        message: item.text,
      }))
      setContacts(formatted)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleDeleteContactClick = (id: string) => {
    setContactToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmContactDelete = async () => {
    if (!contactToDelete) return;

    try {
      const token = localStorage.getItem("access_token") || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/contact-msgs/delete/${contactToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await fetchContacts(); // O'chirgandan keyin yangilash
        setDeleteModalOpen(false);
        setContactToDelete(null);
      } else {
        const errorData = await res.json();
        toast(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      toast("Contactni o'chirishda xatolik yuz berdi");
    }
  };
  return (
    <>
      <motion.div
        key="contacts"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/10  rounded-2xl   shadow-2xl mt-10 overflow-hidden overflow-y-auto max-h-[600px] flex flex-col"
      >
        <div className="p-8 border-b  flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Mail className="h-6 w-6 mr-3 text-blue-700" />
            Murojatlar boshqaruvi
          </h2>
        </div>

        {/* Bu yerda scrollable qism */}
        <div className="overflow-y-auto flex-grow px-6 pb-6 w-full">
          {loading ? (
            <div className="p-4 text-gray-800">Yuklanmoqda...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  {['№', 'Ism', 'Email', 'Telefon', 'Xabar', 'Sana', 'Amallar'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-8">
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact: contactType, index) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-400/10 transition-all duration-300 border-b border-gray-200"
                    >
                      {/* № */}
                      <td className="px-6 py-4 text-gray-400 font-bold">{index + 1}</td>

                      {/* Ism */}
                      <td className="px-6 py-10 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-sm">
                            {contact.name?.charAt(0)?.toUpperCase() || '-'}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-600">{contact?.name || '-'}</span>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-500 max-w-[250px]">
                        <div className="max-h-20 overflow-y-auto break-words pr-2">
                          {contact?.email || '-'}
                        </div>
                      </td>
                      {/* Telefon */}
                      <td className="px-6 py-4 text-gray-500">{contact?.phone || '-'}</td>

                      {/* Xabar */}
                      <td className="px-6 py-4 text-gray-500 max-w-[250px]">
                        <div className="max-h-20 overflow-y-auto break-words pr-2">
                          {contact?.message || '-'}
                        </div>
                      </td>


                      {/* Sana */}
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {contact?.created_at
                          ? new Date(contact?.created_at).toLocaleDateString('uz-UZ')
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => setSelectedContact(contact)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContactClick(contact.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      {selectedContact && (
                        <div onClick={() => setSelectedContact(null)} className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                          <div onClick={(e) => e.stopPropagation()} className="bg-white/80 p-6 rounded-lg w-[500px] text-start text-lg space-y-4">
                            <h2 className="text-2xl text-gray-800 font-semibold mb-4">Ariza tafsilotlari</h2>
                            <p><strong>Ism:</strong> {selectedContact.name}</p>
                            <a target='_blank' href={`mailto:${selectedContact.email}`} className='flex gap-2'>
                              <strong className='text-gray-800'>Email:</strong>
                              <p className='hover:underline text-blue-500'>{selectedContact.email}</p>
                            </a>
                            <a href={`tel:${selectedContact.phone}`} className='flex gap-2'>
                              <strong className='text-gray-800'>Telefon:</strong>
                              <p className='hover:underline text-blue-500 '>{selectedContact.phone}</p>
                            </a>
                            <div className="text-gray-800">
                              <strong>Xabar:</strong>
                              <p className="whitespace-pre-wrap break-words">{selectedContact.message}</p>
                            </div>
                            <button onClick={() => setSelectedContact(null)}
                              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                              Yopish
                            </button>
                          </div>
                        </div>
                      )}

                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>

          )}
          {deleteModalOpen && (
            <div className='fixed inset-0 backdrop-blur-sm flex justify-center items-center rounded-md '>
              <div className='bg-gray-50 shadow-2xl p-6 rounded-lg  ml-24 max-w-[570px]'>
                <h1 className='text-2xl text-center text-gray-600 font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
                <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className='py-3 px-10 text-white bg-gray-500 rounded-lg font-[600] hover:bg-gray-600 duration-300'>Bekor qilish
                  </button>
                  <button
                    onClick={handleConfirmContactDelete}
                    className='py-3 px-14 text-white bg-red-600 rounded-lg font-[600] hover:bg-red-700 duration-300'>O'chirish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default AdminContact