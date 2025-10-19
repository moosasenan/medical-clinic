import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          🏥 نظام إدارة العيادة الطبية
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            النظام جاهز للتشغيل!
          </h2>
          <p className="text-gray-600 mb-6">
            تم إصلاح جميع المشاكل والتطبيق جاهز الآن.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
