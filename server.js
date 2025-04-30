const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');  // Para fazer requisições HTTP
const fs = require('fs');  // Para manipulação de arquivos

const app = express();
const port = 3001;

// Configuração do multer para salvar as imagens com o nome original do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Pasta de destino para as imagens
  },
  filename: (req, file, cb) => {
    // Usando o nome original do arquivo (não usando números)
    cb(null, file.originalname); // Nome original do arquivo
  }
});

const upload = multer({ storage: storage });

// Middleware para servir arquivos estáticos (como HTML, JS, CSS)
app.use(express.static('public'));

// Servindo a pasta 'uploads' como arquivo estático
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Função para ler e atualizar o contador de IDs
const getNextId = () => {
  const filePath = './idCounter.json';
  
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    const nextId = data.counter + 1;

    // Atualizando o contador
    fs.writeFileSync(filePath, JSON.stringify({ counter: nextId }));

    return nextId.toString();  // Convertendo o id para string
  } else {
    // Caso o arquivo não exista, cria o contador com valor inicial 1
    fs.writeFileSync(filePath, JSON.stringify({ counter: 1 }));
    return '1';  // Retornando o id como string
  }
};

// Rota para upload de imagens
app.post('/upload', upload.single('image'), async (req, res) => {
  const { redirectUrl } = req.body;  // Pegando a URL do formulário

  if (!req.file || !redirectUrl) {
    return res.status(400).send('Imagem e URL são obrigatórias.');
  }

  const imageId = getNextId();
  const imageUrl = `http://10.105.196.6:3001/uploads/${req.file.filename}`;

  try {
    // Envia para o JSON Server com a URL de redirecionamento associada
    await axios.post('http://10.105.196.6:3000/carousel_images', {
      id: imageId,
      url: imageUrl,
      redirectUrl: redirectUrl  // Adicionando a URL de redirecionamento
    });

    res.send(`Imagem carregada com sucesso!`);  // Responde com sucesso
  } catch (error) {
    console.error('Erro ao salvar no JSON Server:', error);
    res.status(500).send('Erro ao salvar no JSON Server.');  // Responde com erro
  }
});

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://10.105.196.6:${port}`);
});
