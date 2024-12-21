// 選取 DOM 元素
const output = document.getElementById("output");
const input = document.getElementById("input");
const cursor = document.getElementById("cursor");
const inputMirror = document.getElementById("input-mirror");
let secretUnlocked = false;

// 更新光標位置
function updateCursorPosition() {
  inputMirror.textContent = input.value || "\u00a0"; // 顯示空格防止光標錯位
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
  "Welcome to the Interactive Terminal!\nType 『help』 to see available commands.",
  "glow-green"
);

// 命令處理函數
function processCommand(command) {
  if (command === "help") {
    printOutput(
      `Available commands:
『help』 - Show this help message
『whoami』 - Display user information
『url [link]』 - Open the specified URL
『system』 - Display system information
『tree』 - Display file structure
『start [file]』 - Open a file or program
『unblock [code]』 - Unlock locked files
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
  } else if (command.startsWith("url")) {
    const parts = command.split(" ");
    if (parts.length !== 2 || !isValidURL(parts[1])) {
      printOutput("Invalid URL. Please provide a valid link.", "text-warning");
    } else {
      const url = parts[1];
      const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(fullUrl, "_blank");
      printOutput(`Opening URL: ${fullUrl}`, "glow-green");
    }
  } else if (command === "system") {
    printOutput(
      `System Information:
Owner: Wendeng
OS: ${navigator.platform}
Hardware: ${navigator.hardwareConcurrency} Cores, ${navigator.deviceMemory || "Unknown"} GB RAM`,
      "glow-green"
    );
  } else if (command === "tree") {
    printOutput(
      `
📂 <span class="glow-blue">OWNER</span>
  📄 <span class="glow-green">config.sys</span>
  📄 <span class="glow-green">system.log</span>
  📄 <span class="glow-green">README.md</span>
  📄 <span class="glow-green">DATA.csv</span>
📂 <span class="glow-blue">FILES</span>
  📂 <span class="glow-blue">PICTURE</span>
    📄 <span class="glow-yellow">image1.jpg</span>
    🎞 <span class="glow-yellow">video1.mp4</span>
  📂 <span class="glow-blue">NOTES</span>
    ㊙ <span class="glow-orange">SECRET.txt</span>
📂 <span class="glow-blue">PROGRAMS</span>
  🗂️ <span class="glow-green">RUN.bat</span>`,
      "glow-green"
    );
  } else if (command.startsWith("start")) {
    const file = command.split(" ")[1];
    if (!file) {
      printOutput("Please specify a file to open.", "text-error");
      return;
    }

    if (file.toUpperCase() === "DATA.csv") {
      printOutput(
        `Name: <span class="glow-yellow">Wendeng</span>\nPermission: <span class="glow-red">Admin</span>\nRole: Creator and Owner of this Website.`,
        "glow-green"
      );
    } else if (file.toUpperCase() === "SECRET.txt") {
      if (!secretUnlocked) {
        printOutput("Access denied. Use 'unblock [password]' to unlock.", "text-warning");
      } else {
        printOutput("SECRET.txt fuckyou", "glow-green");
      }
    } else if (file.toUpperCase() === "RUN.bat") {
      printOutput("Executing program...", "glow-green");
      setTimeout(() => {
        window.open("https://github.com/wendneg/wendneg.github.io/tree/main", "_blank");
        printOutput("Run successful. Redirecting...", "glow-green");
      }, 5000);
    } else {
      printOutput(`[⚠️warning] File not found: ${file}`, "text-error");
    }
  } else if (command.startsWith("unblock")) {
    const code = command.split(" ")[1];
    if (code === "864000") {
      secretUnlocked = true;
      printOutput(
        "File 'SECRET.TXT' successfully unlocked. Use 'start SECRET.TXT' to access the contents.",
        "glow-green"
      );
    } else {
      printOutput("Invalid code. Unable to unlock the file.", "text-error");
    }
  } else if (command === "clear") {
    output.innerHTML = "";
  } else if (command === "shutdown") {
    printOutput("Shutting down...", "text-error");
    setTimeout(() => {
      document.body.innerHTML = "<div style='text-align:center;color:#00ff00;'>System Shut Down.</div>";
    }, 2000);
  } else {
    printOutput(`[⚠️warning] Command not found: ${command}`, "text-error");
  }
}

// URL 驗證輔助函數
function isValidURL(url) {
  const urlPattern = /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
  return urlPattern.test(url);
}

// 顯示輸出輔助函數
function printOutput(message, className = "text-info") {
  const line = document.createElement("div");
  line.className = className;
  line.innerHTML = message.replace(/『(.*?)』/g, '<span class="glow-yellow">$1</span>');
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}
