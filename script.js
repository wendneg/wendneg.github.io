document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const input = document.getElementById("input");
  const cursor = document.getElementById("cursor");

  // 打字機效果
  function typeText(contentArray, callback) {
    let i = 0;
    const line = document.createElement("div");
    output.appendChild(line);

    function type() {
      if (i < contentArray.length) {
        const { text, style } = contentArray[i];
        const span = document.createElement("span");
        span.textContent = text;
        span.className = style;
        line.appendChild(span);
        output.scrollTop = output.scrollHeight;
        i++;
        setTimeout(type, 150); // 放慢速度到 150ms
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  function handleCommand(command) {
    const args = command.split(" ");
    const mainCommand = args[0];

    switch (mainCommand) {
      case "help":
        typeText([
          { text: "Available commands: ", style: "text-info" },
          { text: "help, whoami, url, status, clear", style: "help-glow" },
        ]);
        break;
      case "whoami":
        typeText([
          { text: "Username: ", style: "text-info" },
          { text: "Anonymous", style: "text-highlight" },
          { text: "\nPermission: ", style: "text-info" },
          { text: "[Visitor]", style: "glow-red" },
          { text: "\nIP Address: ", style: "text-info" },
          { text: "192.168.1.1", style: "glow-blue" },
          { text: "\nDevice: ", style: "text-info" },
          { text: "Windows 10, Chrome", style: "glow-yellow" },
        ]);
        break;
      case "url":
        if (args.length > 1) {
          let url = args[1];
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
          }
          if (isValidURL(url)) {
            window.open(url, "_blank");
            typeText([{ text: `Opening URL: ${url}`, style: "text-highlight" }]);
          } else {
            typeText([{ text: "Invalid URL format", style: "text-warning glow-yellow" }]);
          }
        } else {
          typeText([{ text: "Usage: url [link]", style: "text-warning glow-yellow" }]);
        }
        break;
      case "clear":
        output.innerHTML = "";
        break;
      default:
        typeText([
          { text: "[⚠️warning] Unknown command: ", style: "text-error" },
          { text: `"${mainCommand}"`, style: "text-highlight" },
        ]);
    }
  }

  function initializeTerminal() {
    typeText(
      [
        { text: "Welcome to the Interactive Terminal!", style: "text-info" },
        { text: "\nType 'help' to see available commands.", style: "help-glow" },
      ],
      () => input.focus()
    );
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value.trim();
      if (command) {
        typeText([
          { text: "C:\\Users\\Anonymous> ", style: "text-info" },
          { text: command, style: "text-highlight" },
        ]);
        handleCommand(command);
      }
      input.value = "";
    }
  });

  initializeTerminal();
});

function isValidURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?([a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}|[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})(:[0-9]{1,5})?(\\/.*)?$",
    "i"
  );
  return pattern.test(url);
}
