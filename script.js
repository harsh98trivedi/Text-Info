const GSM7_BASIC = ("@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ !" +
  "\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "ÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà").split('');
const GSM7_EXTENDED = ['^', '{', '}', '\\', '[', '~', ']', '|', '€'];

function isGSM7(str) {
  return [...str].every(ch => GSM7_BASIC.includes(ch) || GSM7_EXTENDED.includes(ch));
}
function getSMSEncoding(str) {
  return isGSM7(str) ? "GSM 7" : "Unicode";
}
function getSMSPartsAndRemaining(str, encoding) {
  if (encoding === "GSM 7") {
    let extCount = 0;
    for (const ch of str) if (GSM7_EXTENDED.includes(ch)) extCount++;
    const len = str.length + extCount;
    if (len <= 160) return { parts: 1, remaining: 160 - len };
    const partLen = 153;
    const parts = Math.ceil(len / partLen);
    return { parts, remaining: parts * partLen - len };
  } else {
    if (str.length <= 70) return { parts: 1, remaining: 70 - str.length };
    const partLen = 67;
    const parts = Math.ceil(str.length / partLen);
    return { parts, remaining: parts * partLen - str.length };
  }
}
function isLetter(c) { return /[A-Za-zÀ-ÖØ-öø-ÿĀ-žḀ-ỿ]/.test(c); }
function isSymbol(c) { return !(/[A-Za-zÀ-ÖØ-öø-ÿĀ-žḀ-ỿ0-9 ]/.test(c)) && c.trim() !== ""; }
function updateCounts() {
  const text = document.getElementById("inputText").value;
  document.getElementById("charCount").textContent = [...text].length;
  document.getElementById("wordCount").textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById("spaceCount").textContent = (text.match(/ /g) || []).length;
  document.getElementById("letterCount").textContent = [...text].filter(isLetter).length;
  document.getElementById("symbolCount").textContent = [...text].filter(isSymbol).length;

  const encoding = getSMSEncoding(text);
  const { parts, remaining } = getSMSPartsAndRemaining(text, encoding);
  document.getElementById("encoding").textContent = encoding;
  document.getElementById("parts").textContent = parts;
  document.getElementById("remaining").textContent = remaining;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', updateCounts);
  updateCounts();
});
