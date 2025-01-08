var clickCount = 0;

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        const color = button.id.split("-")[1];
        document.getElementById(`circ-${color}`).classList.toggle("hidden");
        clickCount++;

        if (clickCount % 5 === 0) {
            labelNum = clickCount / 5;
            if (labelNum <= 3) {
                document.getElementById(`label${labelNum}`).classList.toggle("hidden");
            }
        }
    });
});