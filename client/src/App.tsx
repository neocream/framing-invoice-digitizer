import React, { useState } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [invoices, setInvoices] = useState([]);

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

  try {
    // fetch from n8n
    const invoice = await calln8n(imageUrl);
    if (!invoice) {
      throw new Error("No invoice returned from calln8n");
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
      throw new Error(`Response not ok, error code ${response.status}`);
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
    try {
      const response = await fetch('http://localhost:3000/api/csv-export', {
        method: 'GET',
        headers: { accept: '*/*' }
      });

      if (!response.ok) {
        console.log(response)
        throw new Error(`Response not ok, error code ${response.status}`);
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

  return (
    <>
      <div>
        {/* upload section */}
        <label>Image URL</label>   
        <input type='text' value={imageUrl} onChange={e=> setImageUrl(e.target.value)}/>
        <button onClick={handleUpload}>Send</button>
      </div>
      <div>
        {/* invoice feed */}
        <ul>
          {invoices.map(invoice => <li>{invoice}</li>)}
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
