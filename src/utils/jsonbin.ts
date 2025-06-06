const BIN_ID = '684233858a456b7966aa01e1';
const API_KEY = process.env.NEXT_PUBLIC_JSONBIN_API_KEY!;

export async function updateJsonBin(newData: any) {
  const url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
    },
    body: JSON.stringify(newData),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to update JSONBin');
  }

  return res.json();
}
