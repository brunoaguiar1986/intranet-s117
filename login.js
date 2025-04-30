const defaultButtonText = document.getElementById('defaultBtn');
const correctPasswordIcon = document.getElementById('correctBtn');


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

delay(170).then(() => { 

});

var contas = [
    { usuario: "joseroberto", senha: "s117" }
];

function login() {
    console.log('Login acionado');
    var usuario = document.getElementById('usuario').value;
    var senha = document.getElementById('senha').value;

    var contaEncontrada = contas.find(conta => conta.usuario === usuario && conta.senha === senha);
    
    if (contaEncontrada) {
        localStorage.setItem("contaLogada", "1");
        defaultButtonText.style.opacity = '0%';
        delay(550).then(() => { 
            defaultButtonText.style.display = 'none';
            correctPasswordIcon.style.display = 'flex';
            delay(400).then(() => { 
                correctPasswordIcon.style.opacity = '100%';
            });
            
        });

        delay(2000).then(() => { 
            window.location.href = 'admin.html';
        });
        
    } else {
        alert('Email ou senha incorretos!');
    }
}
