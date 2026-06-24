function sendAI(){

let input=document.getElementById("aiText");
let msg=input.value.trim();
if(!msg) return;

let box=document.getElementById("aiMessages");
box.innerHTML+=`<div class="user">You: ${msg}</div>`;

/* 🔥 GET TRADES DATA */
let trades = JSON.parse(localStorage.getItem("t")) || [];

let total = trades.reduce((a,b)=>a+b.pl,0);
let wins = trades.filter(t=>t.pl>0).length;
let loss = trades.filter(t=>t.pl<0).length;
let winrate = trades.length ? (wins/trades.length)*100 : 0;

/* 🧠 SMART AI LOGIC */
let response = "";

msg = msg.toLowerCase();

if(msg.includes("performance") || msg.includes("journal")){

response = `
AI Analysis 📊<br><br>
Total Trades: ${trades.length}<br>
Wins: ${wins}<br>
Losses: ${loss}<br>
Win Rate: ${winrate.toFixed(1)}%<br>
Net P/L: R${total.toFixed(2)}<br><br>

Insight: ${
winrate > 60
? "Strong system, scale cautiously."
: winrate > 40
? "Break-even behavior, refine entries."
: "Weak edge, focus on confirmations only."
}
`;

}
else if(msg.includes("loss")){
response="AI: Your losses suggest either early entries or weak confirmation. Reduce frequency.";
}
else if(msg.includes("gold") || msg.includes("xau")){
response="AI: XAUUSD reacts to liquidity sweeps. Wait for false breakout + retest.";
}
else if(msg.includes("psychology")){
response=`AI Psychology Score 🧠: ${Math.max(0,100-winrate).toFixed(1)}% emotional risk detected.`;
}
else{
response="AI: Focus on structure, liquidity, and confirmation entries.";
}

setTimeout(()=>{
box.innerHTML+=`<div class="bot">${response}</div>`;
box.scrollTop=box.scrollHeight;
},500);

input.value="";
}