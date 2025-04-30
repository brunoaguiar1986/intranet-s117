// Gerador da data
function gerarData() {
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const dataAtual = new Date();
    const diaSemana = diasSemana[dataAtual.getDay()];
    const dia = dataAtual.getDate();
    const mes = meses[dataAtual.getMonth()];
    const ano = dataAtual.getFullYear();

    const dataFormatada = `${diaSemana}, ${dia} de ${mes} de ${ano}`;
    document.getElementById("date").textContent = dataFormatada;
}

window.onload = gerarData;

localStorage.setItem("contaLogada", "0");

const API_URL = "http://10.105.196.6:3000/links";

async function carregarLinks() {
    try {
        const response = await fetch(API_URL);
        let links = await response.json();

        // Ordena os links pela ordem salva
        links.sort((a, b) => a.ordem - b.ordem);

        atualizarMenuLateral(links);
    } catch (error) {
        console.error("Erro ao carregar os links:", error);
    }
}

function atualizarMenuLateral(links) {
    const menuLateral = document.getElementById("linksContainer");
    menuLateral.innerHTML = "";

    links.forEach(link => {
        const linkElement = document.createElement("a");
        linkElement.href = link.url;
        linkElement.classList.add("linkNavLeft");
        linkElement.textContent = link.nome;
        linkElement.target = "_blank";

        const separator = document.createElement("hr");
        separator.classList.add("separatorNav2");

        menuLateral.appendChild(linkElement);
        menuLateral.appendChild(separator);
    });
}

document.addEventListener("DOMContentLoaded", carregarLinks);