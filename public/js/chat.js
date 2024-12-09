const chatWindow = document.getElementById("chat_window");
const msgFeed = document.getElementById("message_feed");
const chatInputForm = document.getElementById("chat_input_form");
var ch = new Character();

// Onload - grab Character object from session storage
(function() {
    fetch("http://localhost:3000/api/get-character")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((character) => {
        console.log("Character data:", character);
        ch.decode(character);
        document.getElementById("connected_to").innerHTML = `
            You've been connected to ${ch.name}. Say hi!
        `;
    })
    .catch((error) => {
        console.error("Error fetching character data:", error);
        document.getElementById("connected_to").innerHTML = `
            Not connected to a partner. <a href="../index.html">Start a new chat.</a>
        `;
        disableInputs();
    });
    document.getElementById("chat_input").focus();
})();

function textBubble(source, message) {
    const bubble = document.createElement("article");
    bubble.classList.add("bubble", source);
    bubble.textContent = message;
    return bubble;
}

function newBubble(bubble) {
    msgFeed.appendChild(bubble);
    // Scroll to bottom
    msgFeed.scrollTop = msgFeed.scrollHeight;
}

function startNewChatBubble() {
    const newChatLink = document.createElement("a");
    newChatLink.href = "../index.html";
    newChatLink.textContent = "Click here to start a new chat.";
    const newChatBubble = document.createElement("article");
    newChatBubble.classList.add("bubble", "sys");
    newChatBubble.appendChild(newChatLink);
    return newChatBubble;
}

function disableInputs() {
    document.getElementById("send_button").disabled = true;
    document.getElementById("chat_input").disabled = true;
}

chatInputForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = chatInputForm.elements["chat_input"].value;
    document.getElementById("chat_input").value = "";
    newBubble(textBubble("user", message));
    const response = await ch.chat(message);
    newBubble(textBubble("comp", response));
    if (message.toLowerCase().includes("bye")) {
        disableInputs();
        newBubble(textBubble("sys", `== ${ch.name} disconnected ==`));
        newBubble(startNewChatBubble());
        endSession();
    }
})