document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const input = document.getElementById("input");
  const cursor = document.getElementById("cursor");

  // 打字機效果：逐字顯示內容
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
        setTimeout(type, 50); // 調整速度
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  // 獲取用戶 IP
  function getUserIP(callback) {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => callback(data.ip))
      .catch(() => callback("Unable to fetch IP"));
  }

  // 處理指令
  function handleCommand(command) {
    switch (command) {
      case "help":
        typeText([
          { text: "Available commands: ", style: "text-system" },
          { text: "help, ip, status, clear", style: "text-highlight" },
        ]);
        break;
      case "ip":
        getUserIP((ip) => {
          typeText([{ text: `Your IP address is: ${ip}`, style: "text-info" }]);
        });
        break;
      case "status":
        const memoryUsage = (Math.random() * 50 + 50).toFixed(2);
        const cpuLoad = (Math.random() * 30 + 10).toFixed(2);
        typeText([
          { text: "System Status:", style: "text-info" },
          { text: `\nMemory Usage: ${memoryUsage}%`, style: "text-system" },
          { text: `\nCPU Load: ${cpuLoad}%`, style: "text-system" },
        ]);
        break;
      case "clear":
        output.innerHTML = "";
        break;
      default:
        typeText([
          { text: `Unknown command: `, style: "text-error" },
          { text: `"${command}"`, style: "text-highlight" },
        ]);
    }
  }

  // 初始化終端
  function initializeTerminal() {
    typeText(
      [
        { text: "Welcome to the Interactive Terminal!", style: "text-system" },
        { text: "\nType 'help' to see available commands.", style: "text-system" },
      ],
      () => input.focus()
    );
  }

  // 動態更新光標位置
  input.addEventListener("input", () => {
    const textWidth = getTextWidth(input.value, window.getComputedStyle(input));
    cursor.style.left = `${textWidth}px`;
  });

  // 計算文本寬度
  function getTextWidth(text, style) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = style.font;
    return context.measureText(text).width;
  }

  // 處理輸入命令
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value.trim();
      if (command) {
        typeText([
          { text: "C:\\Users\\Anonymous> ", style: "text-system" },
          { text: command, style: "text-highlight" },
        ]);
        handleCommand(command);
      }
      input.value = "";
      cursor.style.left = "0"; // 重置光標位置
    }
  });

  // 啟動終端
  initializeTerminal();
});
