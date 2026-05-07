exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'POST only' })
    };
  }

  // CORS headers
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
    const message = `🔥 حجز جديد - ليفيل لوكيشن\n\n` +
      `الاسم: ${name}\n` +
      `الموبايل: ${phone}\n` +
      `التاريخ: ${date}\n` +
      `الساعة: ${time}\n` +
      `طريقة الحجز: ${payment}`;

    // WhatsApp Business API credentials
    const token = 'EAAZAczgzRxlQBRfkm9KA0WWJJzSXDmEWt8gAZCLafZC9cn4styABMqZCfUZCB4TDCJdFqH0vIivLYzoFjAXh7dt9lMZBQhFSQvtYVsP7fmmVfXZCZAPheWsA0YIPEu46aZCIEJEyaBfD4mpBI3hBoRzjesIMZA4k3d8Ksfdcu1JX9YBBnVe3qZAXcpGCQkZAVRGi6JDOy8nrystmXWoVNJDHIjJ1pRZABhhu1iJg2GqM3EjFxgzymF1ckFYX2ASlKZC5iHpyZCXKpsZD';
    const phoneNumberId = '1141873642344210';
    const yourWhatsapp = '201065234640';

    // Send to WhatsApp API
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: yourWhatsapp,
        type: 'text',
        text: { body: message }
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'success', msg: 'تم الإرسال' })
      };
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ status: 'error', msg: data })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'error', msg: error.message })
    };
  }
};
