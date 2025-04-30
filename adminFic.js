const apiUrl = "http://10.105.196.6:3000/fic_links";
        const form = document.getElementById("linkForm");
        const listaLinks = document.getElementById("listaLinks");
        const linkId = document.getElementById("linkId");
        const linkNome = document.getElementById("linkNome");
        const linkUrl = document.getElementById("linkUrl");

        document.addEventListener("DOMContentLoaded", carregarLinks);

        async function carregarLinks() {
            listaLinks.innerHTML = "";
            try {
                const response = await fetch(apiUrl);
                const links = await response.json();
                links.sort((a, b) => a.id - b.id);
                links.forEach(link => {
                    const li = document.createElement("li");
                    li.classList.add("link-item");
                    li.innerHTML = `
                        <div class="link-info">
                            <strong>${link.nome}</strong>
                            <a class='link' href="${link.url}" target="_blank">${link.url}</a>
                        </div>
                        <div class="buttonsDiv">
                            <button class='buttonsEdit' onclick="editarLink(${String(link.id)}, '${link.nome}', '${link.url}')">
                                <span class='fundoImagem'><img class="editIcon" src="imgs/pen.png" alt=""></span>
                                <span class='fundoTexto'>Editar</span>
                            </button>
                        </div>
                    `;
                    listaLinks.appendChild(li);
                });
            } catch (error) {
                console.error("Erro ao carregar os links:", error);
            }
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = linkId.value ? parseInt(linkId.value) : null;
            const nome = linkNome.value;
            const url = linkUrl.value;

            if (!id) return;

            try {
                const linkData = { id, nome, url };
                await fetch(`${apiUrl}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(linkData)
                });
                
                form.reset();
                linkId.value = "";
                carregarLinks();
            } catch (error) {
                console.error("Erro ao salvar link:", error);
            }
        });

        function editarLink(id, nome, url) {
            linkId.value = id;
            linkNome.value = nome;
            linkUrl.value = url;
        }