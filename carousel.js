const CAROUSEL_IMAGES_API_URL = "http://10.105.196.6:3000/carousel_images";  

async function carregarCarousel() {
    try {
        const response = await fetch(CAROUSEL_IMAGES_API_URL);  
        const imagens = await response.json();  

        atualizarCarousel(imagens);  
    } catch (error) {
        console.error("Erro ao carregar as imagens do carrossel:", error);  
    }
}

function atualizarCarousel(imagens) {
    const carouselContainer = document.querySelector(".carousel-container");
    carouselContainer.innerHTML = "";  

    imagens.forEach(imagem => {
        const imgElement = document.createElement("img");
        imgElement.src = imagem.url;  
        imgElement.alt = "Imagem do Carrossel"; 
        imgElement.setAttribute("onclick", `window.open('${imagem.redirectUrl}', '_blank')`);  

        carouselContainer.appendChild(imgElement);  
    });

    // Inicializa o carrossel (controle de navegação)
    let index = 0;
    const images = document.querySelectorAll(".carousel-container img");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

    function showSlide(i) {
        if (i >= images.length) index = 0;  
        if (i < 0) index = images.length - 1; 
        carouselContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    next.addEventListener("click", () => {
        index++;  
        showSlide(index);
    });

    prev.addEventListener("click", () => {
        index--;  
        showSlide(index);
    });

    setInterval(() => {
        index++;  
        showSlide(index);
    }, 5000); 
}

document.addEventListener("DOMContentLoaded", carregarCarousel);  
