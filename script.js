function processCommand(command) {
  if (command === "help") {
    printOutput(
      `Available commands:
『help』 - Show this help message
『whoami』 - Display user information
『url [link]』 - Open the specified URL
『system』 - Display system information
『shutdown』 - Shut down the terminal
『clear』 - Clear the terminal screen`,
      "glow-blue"
    );
  } else if (command === "whoami") {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        printOutput(
          `Username: Anonymous
Permission: [Visitor]
Browser: ${navigator.userAgent}
Device: ${navigator.platform}
IP Address: ${data.ip}`,
          "glow-green"
        );
      })
      .catch(() => {
        printOutput("Unable to fetch IP address.", "text-error");
      });
  } else if (command.startsWith("url ")) {
    const url = command.slice(4).trim();
    if (url) {
      const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(fullUrl, "_blank");
      printOutput(`Opening URL: ${fullUrl}`, "glow-green");
    } else {
      printOutput("Invalid URL. Please provide a valid link.", "text-warning");
    }
  } else if (command === "system") {
    printOutput(
      `System Information:
Owner: wendeng
OS: ${navigator.platform}
Hardware: ${navigator.hardwareConcurrency} Cores, ${navigator.deviceMemory || "Unknown"} GB RAM`,
      "glow-green"
    );
  } else if (command === "shutdown") {
    printOutput("Shutting down...", "text-error");
    setTimeout(() => {
      document.body.innerHTML = "<div style='text-align:center;color:#00ff00;'>System Shut Down.</div>";
    }, 2000);
  } else if (command === "clear") {
    output.innerHTML = "";
  } else {
    printOutput(`[⚠️warning] Command not found: ${command}`, "text-error");
  }
}
