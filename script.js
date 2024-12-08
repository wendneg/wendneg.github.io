// 選取 DOM 元素
const output = document.getElementById("output");
const input = document.getElementById("input");
const cursor = document.getElementById("cursor");
const inputMirror = document.getElementById("input-mirror");

// 更新光標位置
function updateCursorPosition() {
  inputMirror.textContent = input.value || "\u00a0"; // 如果沒有內容顯示空格，防止光標下移
  const inputMirrorRect = inputMirror.getBoundingClientRect();
  const containerRect = inputMirror.parentElement.getBoundingClientRect();
  cursor.style.left = `${inputMirrorRect.width}px`;
  cursor.style.top = `${inputMirrorRect.top - containerRect.top}px`;
}

// 處理用戶輸入
input.addEventListener("input", updateCursorPosition);

// 模擬命令執行
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim();
    processCommand(command);
    input.value = ""; // 清空輸入框
    updateCursorPosition(); // 重置光標位置
  }
});

// 初始顯示
printOutput(
  "Welcome to the Interactive Terminal!\nType 'help' to see available commands.",
  "glow-green"
);

// 處理命令
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
  } else if (command === "url") {
    const url = command.split(" ")[1];
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
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

// 輸出訊息
function printOutput(message, className = "text-info") {
  const line = document.createElement("div");
  line.className = className;
  line.innerHTML = message.replace(/『(.*?)』/g, '<span class="glow-yellow">$1</span>');
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}
