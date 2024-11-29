var contexto = "";
var indicaciones = "Eres una asitente de mantenimiento, una técnico virtual de mantenimiento eléctrico.";

async function chat(pregunta) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = 'TU API KEY';

    try {
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + apiKey
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{
                    "role": "system",
                    "content": indicaciones + contexto
                }, {
                    "role": "user",
                    "content": pregunta
                }],
                "temperature": 0.7,
                "max_tokens": 150
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        let data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function enviarMensaje() {
    const input = document.getElementById("messageInput");
    const mensaje = input.value;

    if (mensaje.trim() !== "") {
        const chatBox = document.getElementById("chatBox");

        // Mensaje del usuario con avatar
        const userMessage = document.createElement("div");
        userMessage.classList.add("chat-message");
        userMessage.innerHTML = `<img src="img/usuario.png" alt="Avatar Usuario"><span>${mensaje}</span>`;
        chatBox.appendChild(userMessage);

        chatBox.scrollTop = chatBox.scrollHeight;
        input.value = "";

        var respuesta = await chat(mensaje);
        if (respuesta == undefined) {
            respuesta = "Por favor añade una api key que sea válida";
        }
        console.log('Respuesta de ChatGPT:', respuesta);
        contexto = contexto + mensaje + respuesta;

        // Respuesta del chatbot con avatar
        const botResponse = document.createElement("div");
        botResponse.classList.add("chat-response");
        botResponse.innerHTML = `<img src="img/mujer.png" alt="Avatar Bot"><span>${respuesta}</span>`;
        chatBox.appendChild(botResponse);

        chatBox.scrollTop = chatBox.scrollHeight;

        // Llama a la función TTS
        speakText(respuesta);
    }
}

function cargaContexto() {
    const url = 'https://raw.githubusercontent.com/16kram/Archivos-de-datos-del-chatbot-de-mantenimiento/refs/heads/main/contexto.txt';

    fetch(url)
        .then(response => response.text())
        .then(data => {
            contexto = data;
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
}

function teclaEnter() {
    var messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            enviarMensaje();
        }
    });
}

//Función para TTS
function speakText(text) {
    // Crea una instancia de SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Configura el idioma
    utterance.lang = 'es-ES'; // Para español de España

    // Ajusta la velocidad, el tono y el volumen
    utterance.rate = 1; // Velocidad de habla (1 es normal)
    utterance.pitch = 1; // Tono de voz (1 es normal)
    utterance.volume = 1; // Volumen (1 es el máximo)

    // Reproduce el texto
    window.speechSynthesis.speak(utterance);
}


function iniciar() {
    cargaContexto();
    teclaEnter();
}

window.addEventListener("load", iniciar);
