const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Crear una instancia del cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()  // Esto guarda la sesión para no escanear el QR cada vez
});

// Generar el código QR en la terminal para iniciar sesión
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea el código QR con WhatsApp para iniciar sesión');
});

// Confirmar cuando el bot esté listo
client.on('ready', () => {
    console.log('El bot está listo para enviar mensajes');
});

// Escuchar mensajes y responder al comando ".marcar"
client.on('message', async msg => {
    if (msg.body === '.marcar') {  // Comando para activar el bot
        const chat = await msg.getChat();

        // Verificar si el chat es un grupo
        if (chat.isGroup) {
            let mentions = [];
            let text = '';

            // Mencionar a todos los participantes del grupo
            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);
                mentions.push(contact);
                text += `@${contact.number} `;
            }

            // Enviar el mensaje con menciones
            chat.sendMessage(text, { mentions });
        }
    }
});

// Iniciar el cliente de WhatsApp
client.initialize();
