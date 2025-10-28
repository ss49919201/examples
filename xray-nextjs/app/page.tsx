'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const callApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hello?name=OpenTelemetry');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('エラーが発生しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Xray Next.js + OpenTelemetry</h1>

        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-gray-700 mb-4">
            このアプリケーションは OpenTelemetry によって計装されています。
            API を呼び出してトレースデータを生成できます。
          </p>

          <button
            onClick={callApi}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? '読み込み中...' : 'API を呼び出す'}
          </button>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-bold">結果:</p>
            <p>{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
