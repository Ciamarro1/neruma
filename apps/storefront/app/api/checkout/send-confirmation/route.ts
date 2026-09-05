import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, OrderEmailPayload } from '../../../../lib/email/order-email';

export async function POST(request: Request) {
  try {
    const payload: OrderEmailPayload = await request.json();

    if (!payload.orderNumber || !payload.customer?.email) {
      return NextResponse.json(
        { error: 'Dados obrigatórios ausentes: orderNumber e customer.email' },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail(payload);

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      sentTo: payload.customer.email,
      previewUrl: result.previewUrl,
      html: result.html,
    });
  } catch (error: any) {
    console.error('[API Checkout] Erro ao enviar e-mail de confirmação:', error);
    return NextResponse.json(
      { error: 'Falha interna ao processar envio de e-mail', details: error.message },
      { status: 500 }
    );
  }
}
