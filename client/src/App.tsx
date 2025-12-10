import React, { useState } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    const data = await fetch('http://localhost:3000/api/invoices')
    .then(response => {
      if(!response.ok) {
        throw new Error('Response not ok');
      }
      return response.json();
    })
    setInvoices(data);
  }

  const calln8n = async (imageUrl: string) => {
    const n8nurl = 'https://enie.app.n8n.cloud/webhook-test/4eaaf056-4d9c-44c9-b766-9a1ddb228fd7';
    const response = await fetch(n8nurl+'?image-url='+imageUrl, {
      method: 'GET',
      headers: {
        accept: '*/*'   
      }
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Response not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // fetch from n8n
    const invoice = await calln8n(imageUrl);

    // rename properties to match what backend is expecting and add status
    const payload ={
      date: invoice.Date,
      vendor:invoice.Vendor,
      amount:invoice.Total,
      status: "processed"
    }

    // fetch from backend
    console.log(payload);
    const response = await fetch('http://localhost:3000/api/invoices', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Response not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    }); 
  
    // finally refresh invoices feed
    await fetchInvoices();
  };

  return (
    <>
      <div>
        {/* upload section */}
        <form onSubmit={handleSubmit}>
          <label>Image URL</label>   
          <input type='text' value={imageUrl} onChange={e=> setImageUrl(e.target.value)}/>
          <button>Send</button>
        </form>
      </div>
      <div>
        {/* invoice feed */}
        <ul>
          {invoices.map(invoice => <li>{invoice}</li>)}
        </ul>
      </div>
      <div>
        {/* download report */}
      </div>
    </>
  );
}

export default App
