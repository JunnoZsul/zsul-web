const CONTACT_WHATSAPP_NUMBER = '+1 3392351840';
const CONTACT_EMAIL = 'contacto@lzsul.com';

function buildWhatsappUrl(message) {
  const phone = CONTACT_WHATSAPP_NUMBER.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';

  return `https://wa.me/${phone}${text}`;
}

function buildEmailUrl(subject, body) {
  const query = new URLSearchParams({
    subject,
    body
  }).toString();

  return `mailto:${CONTACT_EMAIL}?${query}`;
}

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

    if (CONTACT_EMAIL) {
      const subject = isEnglish ? 'LZsul diagnostic request' : 'Solicitud de diagnóstico LZsul';
      window.location.href = buildEmailUrl(subject, message);

      if (CONTACT_WHATSAPP_NUMBER) {
        setTimeout(function () {
          const wantsWhatsapp = window.confirm(isEnglish
            ? 'Your email was prepared for LZsul. Would you also like to contact us on WhatsApp?'
            : 'Se preparo el correo para LZsul. Tambien quieres comunicarte por WhatsApp?');

          if (wantsWhatsapp) {
            window.open(buildWhatsappUrl(message), '_blank');
          }
        }, 700);
      }
      return;
    }

    if (CONTACT_WHATSAPP_NUMBER) {
      window.open(buildWhatsappUrl(message), '_blank');
      return;
    }

    const copied = await copyMessage(message);
    alert(isEnglish
      ? (copied
        ? 'Your request was prepared and copied. The real LZsul WhatsApp or email still needs to be connected.'
        : 'Your request was prepared. The real LZsul WhatsApp or email still needs to be connected.')
      : (copied
      ? 'Tu solicitud quedó preparada y copiada. Falta conectar el WhatsApp o correo real de LZsul.'
      : 'Tu solicitud quedó preparada. Falta conectar el WhatsApp o correo real de LZsul.'));
  });
});

document.querySelectorAll('.cta-box > div:first-child').forEach(function (content) {
  if (content.querySelector('.direct-contact')) return;

  const isEnglish = document.documentElement.lang === 'en';
  const message = isEnglish
    ? 'Hello, I would like information about LZsul services.'
    : 'Hola, quiero informacion sobre los servicios de LZsul.';
  const subject = isEnglish ? 'Information request - LZsul' : 'Solicitud de informacion - LZsul';
  const links = document.createElement('div');
  const whatsappLink = document.createElement('a');
  const emailLink = document.createElement('a');

  whatsappLink.href = buildWhatsappUrl(message);
  whatsappLink.target = '_blank';
  whatsappLink.rel = 'noopener';
  whatsappLink.textContent = 'WhatsApp: +1 339 235 1840';

  emailLink.href = buildEmailUrl(subject, message);
  emailLink.textContent = 'contacto@lzsul.com';

  links.className = 'direct-contact';
  links.append(whatsappLink, emailLink);

  content.appendChild(links);
});
