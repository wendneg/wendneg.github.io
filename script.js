// 選取 DOM 元素
const output = document.getElementById("output");
const input = document.getElementById("input");
const cursor = document.getElementById("cursor");
const inputMirror = document.getElementById("input-mirror");

// 更新光標位置
function updateCursorPosition() {
  inputMirror.textContent = input.value; // 同步輸入文字到鏡像
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
      『status』 - Display terminal status
      『clear』 - Clear the terminal screen`,
      "glow-blue"
    );
  } else if (command === "whoami") {
    fetch("https://ipinfo.io/json?token=YOUR_API_KEY") // 請替換為你自己的 IP API 密鑰
      .then(response => response.json())
      .then(data => {
        printOutput(
          `Username: Anonymous
Permission: [Visitor]
Browser: ${navigator.userAgent}
Device: ${navigator.platform}
IP Address: ${data.ip}
Location: ${data.city}, ${data.region}, ${data.country}`,
          "glow-green"
        );
      })
      .catch(error => {
        printOutput(
          `Unable to fetch IP address or location information.`,
          "text-error"
        );
      });
  } else if (command.startsWith("url")) {
    const url = command.split(" ")[1];
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
    } else {
      printOutput("Invalid URL. Please provide a valid link.", "text-warning");
    }
  } else if (command === "status") {
    printOutput(
      "Terminal is online and fully operational.\nPerformance: Good\nTheme: Dark mode",
      "glow-green"
    );
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
  line.innerHTML = message.replace(/『(.*?)』/g, '<span class="glow-yellow">$1</span>'); // 特殊命令高亮
  output.appendChild(line);
  output.scrollTop = output.scrollHeight; // 自動捲到底部
}
