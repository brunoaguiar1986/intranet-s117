const API_URL = "http://10.105.196.6:3000/fic_links";

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        
        // Verifica se o status da resposta foi OK
        if (!response.ok) {
            throw new Error(`Erro ao carregar os dados: ${response.statusText}`);
        }

        // Tenta parsear a resposta como JSON
        let data = await response.json();

        // Verifica se o JSON está correto
        if (!Array.isArray(data) && !data.cai_links) {
            throw new Error("Resposta da API não está no formato esperado");
        }

        console.log("Dados carregados:", data);
        gerarConteudo(data);
    } catch (error) {
        console.error(error);
        alert("Ocorreu um erro ao carregar os dados. Por favor, verifique a API.");
    }
}

function gerarConteudo(data) {
    const links = Array.isArray(data) ? data : data.cai_links;

    if (!links || !Array.isArray(links)) {
        console.error("Nenhum link válido encontrado na resposta da API");
        return;
    }

    // Criação de um bloco para cada categoria
    for (let categoria = 1; categoria <= 7; categoria++) {
        // Filtra os links pela categoria
        const linksCategoria = links.filter(link => link.categoria == categoria);
        
        if (linksCategoria.length > 0) {
            const groupBlocos = document.querySelector(`#categoria-${categoria}`);
            
            if (!groupBlocos) {
                console.error(`Elemento .groupBlocos#categoria-${categoria} não encontrado`);
                return;
            }
            
            groupBlocos.innerHTML = ""; // Limpa a área da categoria
            
            // Gera os links para a categoria
            linksCategoria.forEach(link => {
                const buttonDiv = document.createElement("div");
                buttonDiv.classList.add("buttonInstrutor1");
                buttonDiv.setAttribute("onclick", `location.href='${link.url}'`);
                
                const spanText = document.createElement("span");
                spanText.classList.add("buttonText");
                spanText.textContent = link.nome;
                
                buttonDiv.appendChild(spanText);
                groupBlocos.appendChild(buttonDiv);
            });

            // Adiciona o separador após os links da categoria
            const separator = document.createElement("hr");
            separator.classList.add("separatorNav4");
            groupBlocos.appendChild(separator);
        }
    }
}

document.addEventListener("DOMContentLoaded", fetchData);
