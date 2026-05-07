const https = require('https');

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'POST only' })
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Parse form data
    const params = new URLSearchParams(event.body);
    const name = params.get('name') || 'غير محدد';
    const phone = params.get('phone') || 'غير محدد';
    const date = params.get('date') || 'غير محدد';
    const time = params.get('time') || 'غير محدد';
    const payment = params.get('payment') || 'غير محدد';

    // Build WhatsApp message
    const message = `🔥 حجز جديد - ليفيل لوكيشن\n\nالاسم: ${name}\nالموبايل: ${phone}\nالتاريخ: ${date}\nالساعة: ${time}\nطريقة الحجز: ${payment}`;

    // WhatsApp Business API credentials
    const token = 'EAAZAczgzRxlQBRfkm9KA0WWJJzSXDmEWt8gAZCLafZC9cn4styABMqZCfUZCB4TDCJdFqH0vIivLYzoFjAXh7dt9lMZBQhFSQvtYVsP7fmmVfXZCZAPheWsA0YIPEu46aZCIEJEyaBfD4mpBI3hBoRzjesIMZA4k3d8Ksfdcu1JX9YBBnVe3qZAXcpGCQkZAVRGi6JDOy8nrystmXWoVNJDHIjJ1pRZABhhu1iJg2GqM3EjFxgzymF1ckFYX2ASlKZC5iHpyZCXKpsZD';
    const phoneNumberId = '1141873642344210';
    const yourWhatsapp = '201065234640';

    // Send to WhatsApp API using https module
    const postData = JSON.stringify({
      messaging_product: 'whatsapp',
      to: yourWhatsapp,
      type: 'text',
      text: { body: message }
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/v19.0/${phoneNumberId}/messages`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body: data });
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(postData);
      req.end();
    });

    if (result.statusCode === 200) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'success', msg: 'تم الإرسال' })
      };
    } else {
      console.log('WhatsApp API Error:', result.body);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'success', msg: 'تم التسجيل' })
      };
    }

  } catch (error) {
    console.log('Function Error:', error.message);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'success', msg: 'تم التسجيل' })
    };
  }
};
