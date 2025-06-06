import { useState, useEffect } from 'react';
import { generateQR } from '@/actions/generateQR';
import { updateJsonBin } from '@/utils/jsonbin';
import Head from 'next/head';

export default function Home() {
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch(
          'https://api.jsonbin.io/v3/b/684233858a456b7966aa01e1/latest',
          {
            headers: {
              'X-Master-Key': process.env.NEXT_PUBLIC_JSONBIN_API_KEY!,
            },
            cache: 'no-store',
          },
        );
        const data = await res.json();
        setCount(data.record.counter || 0);
      } catch {
        setCount(null);
      }
    }
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setQr('');

    try {
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('amount', amount);
      const qrData = await generateQR(formData);
      setQr(qrData);

      const binRes = await fetch(
        `https://api.jsonbin.io/v3/b/684233858a456b7966aa01e1/latest`,
        {
          headers: {
            'X-Master-Key': process.env.NEXT_PUBLIC_JSONBIN_API_KEY!,
          },
          cache: 'no-store',
        },
      );
      const binJson = await binRes.json();
      const currentCount = binJson.record.counter || 0;
      await updateJsonBin({ counter: currentCount + 1 });
      setCount(currentCount + 1);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Thai QR Payment Generator | Aliboxstudio</title>
        <meta
          name="description"
          content="Generate Thai QR Payment codes easily"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="w-full max-w-md mx-4 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-center text-white">
              Thai QR Payment Generator
            </h1>

            <div className="text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                <span className="text-sm text-white/90 font-medium">
                  {count !== null
                    ? `จำนวนการสร้าง QR: ${count}`
                    : 'กำลังโหลดจำนวน...'}
                </span>
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-3">
              <input
                className="w-full border-0 rounded-xl px-4 py-2.5 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                placeholder="เบอร์มือถือ (0812345678)"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                required
              />
              <input
                className="w-full border-0 rounded-xl px-4 py-2.5 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                placeholder="จำนวนเงิน (ไม่เกิน 10,000 บาท)"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 p-2">
                <p className="text-red-200 text-xs text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-xl font-medium backdrop-blur-md transition-colors focus:ring-2 focus:ring-white/50"
            >
              สร้าง QR
            </button>
          </form>
          {qr && (
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-white rounded-xl shadow-lg">
                <img src={qr} alt="QR Code" className="w-full" />
              </div>
              <a
                href={qr}
                download={`thai-qr-${mobile}.png`}
                className="block w-full text-center px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium backdrop-blur-md transition-colors"
              >
                ดาวน์โหลด QR
              </a>
            </div>
          )}
          <div className="flex justify-center text-sm text-grey-200 pt-5">
            aliboxstudio | nextjs | tailwind | jsonbin
          </div>
        </div>
      </main>
    </>
  );
}
