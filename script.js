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
        setTimeout(type, 150); // 打字速度
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

  // 獲取用戶地理位置
  function getUserLocation(callback) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = position.coords;
          callback(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        },
        () => callback("Unable to fetch location")
      );
    } else {
      callback("Geolocation not supported");
    }
  }

  // 獲取瀏覽器和設備資訊
  function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    let browserName = "Unknown";
    let browserVersion = "Unknown";

    if (userAgent.includes("Chrome")) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Firefox")) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([\d.]+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browserName = "Safari";
      browserVersion = userAgent.match(/Version\/([\d.]+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Edge")) {
      browserName = "Edge";
      browserVersion = userAgent.match(/Edg\/([\d.]+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Trident")) {
      browserName = "Internet Explorer";
      browserVersion = userAgent.match(/rv:([\d.]+)/)?.[1] || "Unknown";
    }

    const isMobile = /Mobi|Android/i.test(userAgent);
    const deviceName = isMobile ? "Mobile" : "Desktop";

    return {
      browserName,
      browserVersion,
      platform,
      deviceName,
    };
  }

  // 處理指令
  function handleCommand(command) {
    const args = command.split(" ");
    const mainCommand = args[0];
    switch (mainCommand) {
      case "help":
        typeText([
          { text: "Available commands: ", style: "text-system" },
          { text: "help, whoami, url, status, clear", style: "text-highlight help-glow" },
        ]);
        break;
      case "whoami":
        const { browserName, browserVersion, platform, deviceName } = getBrowserInfo();
        getUserIP((ip) => {
          getUserLocation((location) => {
            typeText([
              { text: "User Information:", style: "text-info" },
              { text: `\nUsername: Anonymous`, style: "text-highlight" },
              { text: `\nPermission: [visitor]`, style: "text-error glow-red" },
              { text: `\nIP Address: ${ip}`, style: "text-info glow-blue" },
              { text: `\nLocation: ${location}`, style: "text-system" },
              { text: `\nBrowser: ${browserName} ${browserVersion}`, style: "text-system" },
              { text: `\nOperating System: ${platform}`, style: "text-system" },
              { text: `\nDevice: ${deviceName}`, style: "text-system" },
            ]);
          });
        });
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
            typeText([{ text: `Invalid URL format`, style: "text-warning glow-yellow" }]);
          }
        } else {
          typeText([{ text: "Usage: url [link]", style: "text-warning glow-yellow" }]);
        }
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
          { text: `[⚠️warning] Unknown command: `, style: "text-warning glow-red" },
          { text: `"${mainCommand}"`, style: "text-highlight" },
        ]);
    }
  }

  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  function initializeTerminal() {
    typeText(
      [
        { text: "Welcome to the Interactive Terminal!", style: "text-system" },
        { text: "\nType 'help' to see available commands.", style: "text-highlight help-glow" },
      ],
      () => input.focus()
    );
  }

  input.addEventListener("input", () => {
    const textWidth = getTextWidth(input.value, window.getComputedStyle(input));
    cursor.style.left = `${textWidth}px`;
  });

  function getTextWidth(text, style) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = style.font;
    return context.measureText(text).width;
  }

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
      cursor.style.left = "0";
    }
  });

  initializeTerminal();
});
