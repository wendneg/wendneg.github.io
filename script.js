// 選取 DOM 元素
const output = document.getElementById("output");
const input = document.getElementById("input");
const cursor = document.getElementById("cursor");

// 更新光標位置
function updateCursorPosition() {
  const inputWidth = input.value.length * 8; // 每字符約占 8px
  cursor.style.transform = `translateX(${inputWidth}px)`;
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
      "Available commands:\n" +
        "help - Show this help message\n" +
        "whoami - Display user information\n" +
        "url [link] - Open the specified URL\n" +
        "status - Display terminal status\n" +
        "clear - Clear the terminal screen\n",
      "glow-blue"
    );
  } else if (command === "whoami") {
    printOutput(
      "Username: Anonymous\n" +
        "Permission: [Visitor]\n" +
        "Browser: " + navigator.userAgent + "\n" +
        "Device: " + navigator.platform + "\n" +
        "IP Address: Not available (requires server support)",
      "glow-green"
    );
  } else if (command.startsWith("url")) {
    const url = command.split(" ")[1];
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
    } else {
      printOutput("Invalid URL. Please provide a valid link.", "text-warning");
    }
  } else if (command === "status") {
    printOutput(
      "Terminal is online and fully operational.\n" +
        "Performance: Good\n" +
        "Theme: Dark mode",
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
  line.textContent = message;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight; // 自動捲到底部
}
