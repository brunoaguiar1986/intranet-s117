const apiUrl = "http://10.105.196.6:3000/links";
const form = document.getElementById("linkForm");
const listaLinks = document.getElementById("listaLinks");
const linkId = document.getElementById("linkId");
const linkNome = document.getElementById("linkNome");
const linkUrl = document.getElementById("linkUrl");

document.addEventListener("DOMContentLoaded", carregarLinks);

// Função para carregar os links e exibi-los
async function carregarLinks() {
    listaLinks.innerHTML = ""; 

    try {
        const response = await fetch(apiUrl);
        let links = await response.json();

        // Ordena os links pela posição salva
        links.sort((a, b) => a.ordem - b.ordem);

        links.forEach(link => {
            const li = document.createElement("li");
            li.classList.add("link-item");
            li.draggable = true;
            li.dataset.id = String(link.id); // Convertendo id para string

            // Criar a div para o nome e link
            const divLinks = document.createElement("div");
            divLinks.classList.add("link-info");
            divLinks.innerHTML = `
                <strong>${link.nome}</strong><a class='link' href="${link.url}" target="_blank">${link.url}</a>
            `;

            // Criar a div para os botões
            const divButtons = document.createElement("div");
            divButtons.classList.add("buttonsDiv");
            divButtons.innerHTML = `
                <button class='buttonsEdit' onclick="editarLink(${String(link.id)}, '${link.nome}', '${link.url}')">
                    <span class='fundoImagem'><img class="editIcon" src="imgs/pen.png" alt=""></span>
                    <span class='fundoTexto'>Editar</span>
                </button>
                <button class='buttonsDelete' onclick="excluirLink(${String(link.id)})">
                    <span class='fundoImagemDel'><img class="deleteIcon" src="imgs/trash-can.png" alt=""></span>
                    <span class='fundoTextoDel'>Deletar</span>
                </button>
            `;

            // Adicionar eventos de arrastar e soltar
            li.addEventListener("dragstart", () => li.classList.add("dragging"));
            li.addEventListener("dragend", () => li.classList.remove("dragging"));

            // Adicionar as divs ao li
            li.appendChild(divLinks);
            li.appendChild(divButtons);

            listaLinks.appendChild(li);
        });

        adicionarEventosArrastar();
    } catch (error) {
        console.error("Erro ao carregar os links:", error);
    }
}

// Adiciona evento de arrastar e soltar
function adicionarEventosArrastar() {
    listaLinks.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const afterElement = pegarElementoAposCursor(listaLinks, e.clientY);
        if (afterElement) {
            listaLinks.insertBefore(dragging, afterElement);
        } else {
            listaLinks.appendChild(dragging);
        }
    });

    listaLinks.addEventListener("drop", salvarOrdemLinks);
}

// Identifica onde o item deve ser solto
function pegarElementoAposCursor(container, y) {
    const elementos = [...container.querySelectorAll(".link-item:not(.dragging)")];
    return elementos.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Salva a nova ordem dos links no JSON Server
async function salvarOrdemLinks() {
    const novaOrdem = [...listaLinks.children].map((li, index) => ({
        id: String(li.dataset.id), // Garantindo que o id seja string
        nome: li.querySelector("strong").textContent,
        url: li.querySelector("a").getAttribute("href"), // Pega a URL correta
        ordem: index
    }));

    try {
        for (const link of novaOrdem) {
            await fetch(`${apiUrl}/${link.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(link)
            });
        }
    } catch (error) {
        console.error("Erro ao salvar a nova ordem dos links:", error);
    }
}

// Adicionar ou editar um link
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = linkId.value ? String(linkId.value) : null; // Convertendo id para string
    const nome = linkNome.value;
    const url = linkUrl.value;

    const linkData = { nome, url };

    try {
        if (id) {
            await fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(linkData)
            });
        } else {
            const response = await fetch(apiUrl);
            const links = await response.json();
            const novoId = links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1;
            linkData.id = String(novoId);
            linkData.ordem = links.length;

            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(linkData)
            });
        }

        form.reset();
        linkId.value = "";
        carregarLinks();
    } catch (error) {
        console.error("Erro ao salvar link:", error);
    }
});

// Editar link
function editarLink(id, nome, url) {
    linkId.value = id;
    linkNome.value = nome;
    linkUrl.value = url;
    document.getElementById("statusEdit").innerHTML="<strong>Editando link: </strong>" + nome;
}

// Excluir link
async function excluirLink(id) {
    if (confirm("Tem certeza que deseja excluir o link?")) {
        try {
            await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
            carregarLinks();
        } catch (error) {
            console.error("Erro ao excluir link:", error);
        }
    }
}
