import { supabase } from './supabaseClient.js'

// دالة اختبار الاتصال بقاعدة البيانات
async function testConnection() {
  const { data, error } = await supabase.from('test_table').select('*')

  if (error) {
    console.error('❌ خطأ في الاتصال بـ Supabase:', error.message)
  } else {
    console.log('✅ الاتصال ناجح! البيانات:', data)
  }
}

testConnection()
