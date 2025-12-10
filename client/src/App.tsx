import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/invoices');

      if (!response.ok) {
        throw new Error(`Response not ok, error code ${response.status}`);
      }

      const data = await response.json();
      setInvoices(data);

    } catch (err) {
      console.error('fetchInvoices error:', err);
  }
};

const calln8n = async (imageUrl: string) => {
  const n8nurl = 'https://enie.app.n8n.cloud/webhook-test/4eaaf056-4d9c-44c9-b766-9a1ddb228fd7';

  try {
    const response = await fetch(`${n8nurl}?image-url=${encodeURIComponent(imageUrl)}`, {
      method: 'GET',
      headers: {
        accept: '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Response not ok, error code ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error('calln8n error:', err);
    return null; 
  }
};

const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // check that imageUrl isn't empty
  if(!imageUrl) {
    setError("Image URL cannot be empty.");
    return;
  }
  try {
    // fetch from n8n
    const invoice = await calln8n(imageUrl);
    if (!invoice) {
      setError("No invoice returned from n8n. Check to make sure n8n workflow is running and try again.");
      return;
    } 

    if(invoice.error) {
      setError("Image could not be read from URL. Check the URL and try again.");
      return;
    }

    // rename properties to match backend expectations
    const payload = {
      date: invoice.Date,
      vendor: invoice.Vendor,
      amount: invoice.Total,
      status: "processed",
    };

    // send invoice to backend
    const response = await fetch('http://localhost:3000/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error);
      return;
    }

    const data = await response.json();
    console.log("Invoice saved:", data);

    // refresh invoices feed
    await fetchInvoices();

  } catch (err) {
    console.error('handleUpload error:', err);
  }
};

  const downloadReport = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/csv-export', {
        method: 'GET',
        headers: { accept: '*/*' }
      });

      if (!response.ok) {
        console.log(response);
        const data = await response.json();
        console.log(data);
        setError(data.error);
        return;
      }

      const report = await response.blob();
      // generate url from returned blob and immediately download it
      const url = URL.createObjectURL(report);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <>
      <div>
        {/* upload section */}
        <label>Image URL</label>   
        <input type='text' value={imageUrl} onChange={e=> setImageUrl(e.target.value)}/>
        <button onClick={handleUpload}>Send</button>
        {error && <p>{error}</p>}
      </div>
      <div>
        {/* invoice feed */}
        <ul>
          {/* slapdash implementation with array indexes because invoices are stored to be exported as csv. With more time I would store 
              invoices normally as an array of objects then in csv export transform into 2d array of strings for csv */}
          {invoices.map((invoice, i) => <li key={i}>{invoice[0]} - {invoice[1]} - ${invoice[2]} - {invoice[3]}</li>)}
        </ul>
      </div>
      <div>
        {/* download report */}
        <button onClick={downloadReport}>Download Report</button>
      </div>
    </>
  );
}

export default App
