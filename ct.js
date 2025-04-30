const API_URL = "http://10.105.196.6:3000/ct_links";

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        let data = await response.json();
        console.log("Dados carregados:", data);
        gerarConteudo(data);
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function gerarConteudo(data) {
    const groupBlocos = document.querySelector(".groupBlocos");
    if (!groupBlocos) {
        console.error("Elemento .groupBlocos não encontrado");
        return;
    }
    groupBlocos.innerHTML = "";
    
    const links = Array.isArray(data) ? data : data.cai_links;

    if (!links || !Array.isArray(links)) {
        console.error("Nenhum link válido encontrado na resposta da API");
        return;
    }

    links.forEach(link => {
        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("buttonCurso1");
        buttonDiv.setAttribute("onclick", `location.href='${link.url}'`);
        
        const spanText = document.createElement("span");
        spanText.classList.add("buttonText");
        spanText.textContent = link.nome;
        
        buttonDiv.appendChild(spanText);
        groupBlocos.appendChild(buttonDiv);
    });
}

document.addEventListener("DOMContentLoaded", fetchData);