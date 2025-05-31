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
  // Use OpenAI API or a dummy summarizer
  // Replace with your OpenAI API call if needed
  return "Summary: This is a placeholder simplified summary of the privacy policy.";
}
