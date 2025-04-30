document.addEventListener("DOMContentLoaded", function () {
    const listaLinks = document.getElementById("listaLinks");
    const linkIdInput = document.getElementById("linkId");
    const linkUrlInput = document.getElementById("linkUrl");

    if (!listaLinks) {
        console.error("Elemento #listaLinks não encontrado.");
        return;
    }

    // Função para carregar as imagens do carrossel
    function carregarCarousel() {
        fetch("http://10.105.196.6:3000/carousel_images")
            .then(response => response.json())
            .then(imagens => {
                listaLinks.innerHTML = ""; // Limpa o conteúdo atual do carrossel

                imagens.forEach(imagem => {
                    const li = document.createElement("li");
                    li.classList.add("linkItem");

                    const img = document.createElement("img");
                    img.src = imagem.url;  // Defina a URL da imagem
                    img.alt = "Imagem do carrossel";
                    img.classList.add("carrosselImage");
                    img.setAttribute("draggable", `false`)

                    // Criando o botão de editar
                    const editButton = document.createElement("button");
                    editButton.classList.add("buttonsEdit");

                    editButton.innerHTML = `
                        <span class='fundoImagem'><img class="editIcon" src="imgs/pen.png" alt=""></span>
                        <span class='fundoTexto'>Editar</span>
                    `;

                    // Função que será chamada quando clicar no botão de editar
                    editButton.addEventListener("click", () => {
                        editarLink(imagem.id, imagem.url, imagem.redirectUrl);  // Agora passando o `url` também
                    });

                    // Criando o botão de deletar
                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("buttonsDelete");

                    deleteButton.innerHTML = `
                        <span class='fundoImagemDel'><img class="deleteIcon" src="imgs/trash-can.png" alt=""></span>
                        <span class='fundoTextoDel'>Deletar</span>
                    `;

                    // Função que será chamada quando clicar no botão de deletar
                    deleteButton.addEventListener("click", () => {
                        // Adiciona a confirmação antes de excluir
                        const confirmacao = window.confirm("Tem certeza que deseja excluir esta imagem?");
                        if (confirmacao) {
                            excluirLink(imagem.id);  // Se confirmar, exclui a imagem
                        }
                    });

                    // Adiciona a imagem e os botões no item da lista
                    const buttonsGroup = document.createElement("div");
                    buttonsGroup.classList.add("ButtonsGroup");
                    buttonsGroup.appendChild(editButton);
                    buttonsGroup.appendChild(deleteButton);

                    li.appendChild(img);
                    li.appendChild(buttonsGroup);
                    listaLinks.appendChild(li);
                });
            })
            .catch(error => {
                console.error("Erro ao carregar as imagens do carrossel:", error);
            });
    }

    // Função de edição de link
    function editarLink(id, url, redirectUrl) {
        // Preenche os campos com os dados do link
        linkIdInput.value = id;
        linkUrlInput.value = redirectUrl;  // Agora usando o RedirectUrl
        linkIdInput.dataset.url = url;  // Armazena a URL da imagem para não alterá-la
    }

    // Função para salvar a URL editada
    function salvarLinkEditado(event) {
        event.preventDefault();  // Impede o comportamento padrão de envio do formulário

        const id = linkIdInput.value;
        const novaUrl = linkUrlInput.value;
        const imagemUrl = linkIdInput.dataset.url;  // Pega a URL da imagem que não foi alterada

        const dadosAtualizados = {
            id: id,
            url: imagemUrl,  // Mantém a URL original da imagem
            redirectUrl: novaUrl  // Atualiza apenas o redirectUrl
        };

        fetch(`http://10.105.196.6:3000/carousel_images/${id}`, {
            method: 'PUT',  // Usa PUT para atualizar
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)  // Converte o objeto para JSON
        })
        .then(response => response.json())
        .then(data => {
            console.log("Imagem atualizada com sucesso:", data);
            carregarCarousel();  // Recarrega o carrossel após a atualização
        })
        .catch(error => {
            console.error("Erro ao atualizar a imagem:", error);
        });
    }

    // Função para excluir a imagem do carrossel
    function excluirLink(id) {
        fetch(`http://10.105.196.6:3000/carousel_images/${id}`, {
            method: 'DELETE',  // Usa DELETE para remover
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Imagem deletada com sucesso:", data);
            carregarCarousel();  // Recarrega o carrossel após a exclusão
        })
        .catch(error => {
            console.error("Erro ao deletar a imagem:", error);
        });
    }

    // Adiciona o evento de submit no formulário de edição
    const form = document.getElementById("linkForm");
    form.addEventListener("submit", salvarLinkEditado);

    carregarCarousel();  // Carrega o carrossel logo após o DOM ser carregado
});
