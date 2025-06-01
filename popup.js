document.getElementById("simplifyBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: extractPrivacyPolicy
      },
      async (results) => {
        const text = results[0].result;
        if (text) {
          const summary = await simplifyText(text);
          document.getElementById("summary").innerText = summary;
        } else {
          document.getElementById("summary").innerText = "No privacy policy found.";
        }
      }
    );
  });
});

function extractPrivacyPolicy() {
  const bodyText = document.body.innerText;
  const lowerText = bodyText.toLowerCase();

  if (lowerText.includes("privacy policy")) {
    return bodyText;
  }
  return "";
}

async function simplifyText(text) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_OPENAI_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Summarize this privacy policy: ${text}` }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

