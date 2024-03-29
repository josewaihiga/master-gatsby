const nodemailer = require('nodemailer');

function generateOrderEmail({ order, total }) {
  return `<div>
  <h2>Your Recent Order for ${total}</h2>
  <p>Please start walking over, we will have your order ready in the next 20 min.
  <ul>
  ${order
    .map(
      (item) => `<li>
    <img  src="${item.thumbnail}" alt="${item.name}"/>
    ${item.size} ${item.name} - ${item.price}
  </li>`
    )
    .join('')}
  </ul>
  <p>Your total is <strong>$${total}</strong> is due at pickup</p>
  <style>
    ul {
      list-style: none;
    }
  </style>
  </div>`;
}

// Create a transport for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  // Check if they have filled out the honeypot
  if (body.mapleSyrup) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Beep Boop ERROR #420' }),
    };
  }

  // Validate the data coming in is correct
  const requiredFields = ['email', 'name', 'order'];

  for (const field of requiredFields) {
    console.log(`Checking that ${field} is good`);
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Oops! You are missing the ${field} field`,
        }),
      };
    }
  }

  // Make sure the order actually has items
  if (!body.order.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Oops! Your order is empty`,
      }),
    };
  }

  // Send the email
  const info = await transporter.sendMail({
    from: 'Slicks Slices <slick@example.com',
    to: 'order@examples.com',
    subject: 'Hello, New Order!',
    html: generateOrderEmail(body),
  });

  console.log(info);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};
