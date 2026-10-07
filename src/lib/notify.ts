type Channel = "email" | "sms" | "whatsapp";

export async function sendNotice(
  channel: Channel,
  to: string,
  subject: string,
  body: string,
) {
  console.info(`[${channel}] to=${to} subject=${subject}\n${body}`);
  return { ok: true, mocked: true };
}

export async function sendOtp(phone: string, code: string) {
  return sendNotice(
    "sms",
    phone,
    "GulPlaze confirmation",
    `Your GulPlaze code is ${code}. It expires in 10 minutes.`,
  );
}

export async function sendOrderConfirmation(to: string, orderNumber: string, total: string) {
  const body = `Thank you. Order ${orderNumber} is received. Total ${total}. We will confirm shortly.`;
  await sendNotice("email", to, `GulPlaze order ${orderNumber}`, body);
  await sendNotice("whatsapp", to, `Order ${orderNumber}`, body);
  await sendNotice("sms", to, `Order ${orderNumber}`, body);
}
