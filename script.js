const CONTACT_WHATSAPP_NUMBER = '';
const CONTACT_EMAIL = '';

function buildContactMessage(form) {
  const isEnglish = document.documentElement.lang === 'en';
  const data = new FormData(form);
  const empty = isEnglish ? 'Not provided' : 'No indicado';
  const name = data.get('name') || empty;
  const email = data.get('email') || empty;
  const phone = data.get('phone') || empty;
  const company = data.get('company') || empty;
  const message = data.get('message') || empty;

  return isEnglish ? [
    'Hello, I would like to request a diagnostic for my data.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `WhatsApp: ${phone}`,
    `Company: ${company}`,
    '',
    `Need: ${message}`
  ].join('\n') : [
    'Hola, quiero solicitar un diagnóstico para mis datos.',
    '',
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `WhatsApp: ${phone}`,
    `Empresa: ${company}`,
    '',
    `Necesidad: ${message}`
  ].join('\n');
}

async function copyMessage(message) {
  if (!navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(message);
    return true;
  } catch {
    return false;
  }
}

document.querySelectorAll('.contact-form').forEach(function (form) {
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const isEnglish = document.documentElement.lang === 'en';
    const message = buildContactMessage(form);

    if (CONTACT_WHATSAPP_NUMBER) {
      const phone = CONTACT_WHATSAPP_NUMBER.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }

    if (CONTACT_EMAIL) {
      const subject = encodeURIComponent(isEnglish ? 'Zsul diagnostic request' : 'Solicitud de diagnóstico Zsul');
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
      return;
    }

    const copied = await copyMessage(message);
    alert(isEnglish
      ? (copied
        ? 'Your request was prepared and copied. The real Zsul WhatsApp or email still needs to be connected.'
        : 'Your request was prepared. The real Zsul WhatsApp or email still needs to be connected.')
      : (copied
      ? 'Tu solicitud quedó preparada y copiada. Falta conectar el WhatsApp o correo real de Zsul.'
      : 'Tu solicitud quedó preparada. Falta conectar el WhatsApp o correo real de Zsul.'));
  });
});
