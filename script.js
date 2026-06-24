const modal = document.getElementById("tradeModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const tradeForm = document.getElementById("tradeForm");
const tradeList = document.getElementById("tradeList");

const totalTrades = document.getElementById("totalTrades");
const totalPL = document.getElementById("totalPL");
const winRate = document.getElementById("winRate");

let trades = JSON.parse(localStorage.getItem("trades")) || [];

openModal.onclick = () => {
    modal.style.display = "flex";
};

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
};

tradeForm.addEventListener("submit", function(e){

    e.preventDefault();

    const trade = {

        pair: document.getElementById("pair").value,
        direction: document.getElementById("direction").value,
        lot: document.getElementById("lot").value,
        entry: document.getElementById("entry").value,
        profit: parseFloat(document.getElementById("profit").value),
        emotion: document.getElementById("emotion").value,
        notes: document.getElementById("notes").value,
        date: new Date().toLocaleDateString()

    };

    trades.unshift(trade);

    localStorage.setItem("trades", JSON.stringify(trades));

    renderTrades();

    tradeForm.reset();

    modal.style.display = "none";

});

function renderTrades(){

    tradeList.innerHTML = "";

    let wins = 0;
    let totalProfit = 0;

    let equityData = [];

    trades.forEach((trade,index) => {

        totalProfit += trade.profit;

        equityData.push(totalProfit);

        if(trade.profit > 0){
            wins++;
        }

        const tradeCard = document.createElement("div");

        tradeCard.classList.add("trade-card");

        tradeCard.innerHTML = `

            <div class="trade-top">

                <div class="trade-pair">
                    ${trade.pair}
                </div>

                <div class="trade-direction ${trade.direction === "BUY" ? "buy" : "sell"}">
                    ${trade.direction}
                </div>

            </div>

            <div class="${trade.profit >= 0 ? "profit" : "loss"}" 
            style="font-size:28px;font-weight:700;">
                ${trade.profit >= 0 ? "+" : ""}
                R${trade.profit}
            </div>

            <div class="trade-details">

                <div class="detail">
                    <h4>Lot Size</h4>
                    <p>${trade.lot}</p>
                </div>

                <div class="detail">
                    <h4>Entry</h4>
                    <p>${trade.entry}</p>
                </div>

                <div class="detail">
                    <h4>Emotion</h4>
                    <p>${trade.emotion || "-"}</p>
                </div>

                <div class="detail">
                    <h4>Date</h4>
                    <p>${trade.date}</p>
                </div>

            </div>

            <div style="margin-top:20px;color:#999;">
                ${trade.notes || ""}
            </div>

        `;

        tradeList.appendChild(tradeCard);

    });

    totalTrades.innerText = trades.length;

    totalPL.innerText = `R${totalProfit}`;

    const rate = trades.length
    ? ((wins / trades.length) * 100).toFixed(0)
    : 0;

    winRate.innerText = `${rate}%`;

    updateChart(equityData);

}

let chart;

function updateChart(data){

    const ctx = document.getElementById("equityChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels: data.map((_,i)=>`Trade ${i+1}`),

            datasets: [{

                label: "Equity",

                data: data,

                tension:0.4

            }]

        },

        options: {

            responsive:true,

            plugins:{

                legend:{
                    labels:{
                        color:"white"
                    }
                }

            },

            scales:{

                x:{
                    ticks:{
                        color:"#888"
                    }
                },

                y:{
                    ticks:{
                        color:"#888"
                    }
                }

            }

        }

    });

}

renderTrades();async function sendAI(){

let input = document.getElementById("userInput");
let msg = input.value;
if(!msg) return;

let chat = document.getElementById("chatBox");

chat.innerHTML += `<p style="color:#D4AF37;">You: ${msg}</p>`;

/* CALL BACKEND (IMPORTANT) */
const res = await fetch("http://localhost:3000/chat", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ message: msg })
});

const data = await res.json();

chat.innerHTML += `<p style="color:#999;">AI: ${data.reply}</p>`;

chat.scrollTop = chat.scrollHeight;
input.value = "";
}function analyzeTradeBehavior(){

let score = 100;

let losses = 0;
let wins = 0;
let revenge = 0;
let overtrade = 0;

trades.forEach(t=>{

if(t.pl < 0) losses++;
if(t.pl > 0) wins++;

if((t.note || "").toLowerCase().includes("revenge")) revenge++;
if((t.note || "").toLowerCase().includes("fomo")) overtrade++;

});

/* penalties */
score -= losses * 8;
score += wins * 5;
score -= revenge * 25;
score -= overtrade * 15;

if(score > 100) score = 100;
if(score < 0) score = 0;

return score;
}