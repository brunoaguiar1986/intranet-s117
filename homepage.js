

const botaoFechar = document.getElementById('closeMenuButton');
const botaoAbrir = document.getElementById('openMenuButton');

function openMenu(){
    const leftNavMobile = document.getElementById('leftNavbar');
    leftNavMobile.style.marginLeft = '0px';
    botaoAbrir.style.display = 'none';
    botaoFechar.style.display = 'block';
}

function closeMenu(){
    const leftNavMobile = document.getElementById('leftNavbar');
    leftNavMobile.style.marginLeft = '-800px';
    botaoAbrir.style.display = 'block';
    botaoFechar.style.display = 'none';
}


