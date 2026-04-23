# 🔍 Caça Palavras

Um jogo de **Caça Palavras** feito com HTML, CSS e JavaScript puro — sem precisar instalar nada!

Cada partida traz um **tema diferente** (animais, frutas, países, esportes e muito mais), palavras sortidas aleatoriamente e um cronômetro para deixar o desafio mais animado.

---

## ✨ Funcionalidades

- 🎲 **Temas variados** a cada novo jogo (10 categorias diferentes)
- ⏱️ **Cronômetro** com barra visual
- 🎯 **3 níveis de dificuldade**: Fácil, Médio e Difícil
- 💡 **Dica** que pisca a letra inicial da palavra
- 🖱️ Funciona com **mouse e toque** (celular/tablet)
- 🌈 Palavras encontradas ficam coloridas no grid
- 📱 Design **responsivo**

---

## 🚀 Como jogar

1. Abra o arquivo `index.html` no seu navegador (não precisa de servidor!)
2. Escolha a dificuldade (Fácil, Médio ou Difícil)
3. Clique e arraste sobre as letras do grid para selecionar uma palavra
4. As palavras podem estar em qualquer direção: horizontal, vertical ou diagonal
5. Use o botão **Dica 💡** se precisar de ajuda
6. Clique em **Novo Jogo 🎲** para jogar com um novo tema

---

## 📁 Estrutura do projeto

```
caca-palavras/
├── index.html   → estrutura da página
├── style.css    → visual e animações
├── game.js      → toda a lógica do jogo
└── README.md    → este arquivo
```

---

## 🌐 Publicar no GitHub Pages (grátis!)

Siga estes passos para deixar o jogo online:

1. Crie uma conta em [github.com](https://github.com) (se ainda não tiver)
2. Crie um novo repositório chamado `caca-palavras`
3. Faça o upload dos 4 arquivos deste projeto
4. Vá em **Settings → Pages**
5. Em "Source", selecione a branch `main` e clique em **Save**
6. Aguarde alguns minutos — seu jogo estará em:
   ```
   https://seu-usuario.github.io/caca-palavras
   ```

---

## 🛠️ Como adicionar novos temas

Abra o arquivo `game.js` e encontre o array `THEMES` no início do arquivo. Adicione um novo objeto seguindo o padrão:

```javascript
{
  name: 'Meu Novo Tema',
  words: ['PALAVRA1', 'PALAVRA2', 'PALAVRA3', 'PALAVRA4', 'PALAVRA5']
}
```

> **Dica:** Use apenas letras maiúsculas e sem acentos (ex: `JAPAO` em vez de `JAPÃO`).

---

## 📄 Licença

Este projeto é de código aberto. Fique à vontade para usar, modificar e compartilhar!
