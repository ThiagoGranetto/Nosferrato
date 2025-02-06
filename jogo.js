const sprites = new Image();
sprites.src = './sprites.png';

const galaxy = new Image();
galaxy.src = '/galaxy.jpg';
// Aguarda o carregamento da imagem galaxy
galaxy.onload = iniciarJogo;

const som_HIT = new Audio();
som_HIT.src = './fx/425348__soundholder__8bit_hit_11.wav';

const som_PASSOU = new Audio();
som_PASSOU.src = './fx/ponto.mp3';

const musicaDeFundo = new Audio();
musicaDeFundo.src = 'fx/fundo.wav';
musicaDeFundo.loop = true; // Faz a música tocar em loop
musicaDeFundo.volume = 0.3; // Ajuste de volume
// Não inicia a música imediatamente para evitar problemas de carregamento
// musicaDeFundo.play();

let frames = 0;
let ultimoTempo = 0;
const FPS_DESEJADO = 60; // FPS desejado agora é 60
const intervaloFrame = 1000 / FPS_DESEJADO; // Intervalo de tempo entre cada frame

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Função loop com controle de FPS]
function loop(tempoAtual) {
  const deltaTime = tempoAtual - ultimoTempo;

  if (deltaTime >= intervaloFrame) {
    ultimoTempo = tempoAtual - (deltaTime % intervaloFrame);

    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames++;

    // Limita o número de frames para evitar aceleração
    if (frames > FPS_DESEJADO) {
      frames = 0;
    }
  }
  requestAnimationFrame(loop);
}


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 327,
  spriteY: 0,
  largura: 400,
  altura: 234,
  x: -20,
  y: canvas.height - 230,

  desenha() {
    // Comentei o fillRect para não cobrir o fundo galaxy.
    // Se deixar esse comando, o fundo será preenchido com essa cor e
    // a imagem galaxy ficará escondida.
    // contexto.fillStyle = '';
    // contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]     
function criaChao(){
  const chao = {
    spriteX: 154,
    spriteY: 550,
    largura: 320,
    altura: 140,
    x: 0,
    y: canvas.height - 130,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 1;
      const movimentacao = chao.x - movimentoDoChao;
      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    }
  }
  return chao;
}
const chao = {
  spriteX: 154,
  spriteY: 561,
  largura: 336,
  altura: 163,
  x: 0,
  y: canvas.height -140,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};
function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;
  const margemErro = -5;

  if(flappyBirdY >= chaoY - margemErro) {
    return true;
  }
  return false;
}
function criaFlappyBird(){
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 35,
    altura: 23,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      console.log('devo pular')
      flappyBird.velocidade = - flappyBird.pulo;
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if(fazColisao(flappyBird, globais.chao)) {
        som_HIT.play();
        mudaParaTela(Telas.GAME_OVER);
        return;
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio 
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {     
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;
}
const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  largura: 35,
  altura: 23,
  x: 10,
  y: 50,
  pulo: 4.6,
  pula() {
    flappyBird.velocidade = - flappyBird.pulo;
  },
  gravidade: 0.25,
  velocidade: 0,
  atualiza() {
    if(fazColisao(flappyBird, chao)) {
      som_HIT.play();
      mudaParaTela(Telas.INICIO);
      return;
    }

    flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
    flappyBird.y = flappyBird.y + flappyBird.velocidade;
  },
  desenha() {
    contexto.drawImage(
      sprites,
      flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
      flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x, flappyBird.y,
      flappyBird.largura, flappyBird.altura,
    );
  }
}

// [nosferrato]
const nosferrato = {
  spriteX: 360,
  spriteY: 274,
  largura: 299,
  altura: 155,
  x: canvas.width / 2 - 299 / 2,
  y: canvas.height - 400,
  desenha() {
    contexto.drawImage(
      sprites,
      nosferrato.spriteX, nosferrato.spriteY,
      nosferrato.largura, nosferrato.altura,
      nosferrato.x, nosferrato.y,
      nosferrato.largura, nosferrato.altura,
    );
  },
};

const mensagemGameOver = {
  sX: 120,
  sY: 281,
  w: 228,
  h: 258,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h
    );
  }
}

const medalha = {
  medalhas: [
    { spriteX: 0, spriteY: 78, largura: 44, altura: 44,  },  // Medalha 1 (10 pontos)
    { spriteX: 48, spriteY: 78, largura: 47, altura: 44, }, // Medalha 2 (15 pontos)
    { spriteX: 48, spriteY: 124, largura: 47, altura: 45, }, // Medalha 3 (30 pontos)
    { spriteX: 0, spriteY: 124, largura: 44, altura: 45, }, // Medalha 4 (50 pontos)
  ],
  desenha() {
    let spriteSelecionado = null;

    if (globais.placar.pontuacao >=30) {
      spriteSelecionado = this.medalhas[3]; // Medalha 4
    } else if (globais.placar.pontuacao >=20) {
      spriteSelecionado = this.medalhas[2]; // Medalha 3
    } else if (globais.placar.pontuacao >= 15) {
      spriteSelecionado = this.medalhas[1]; // Medalha 2
    } else if (globais.placar.pontuacao >= 10) {
      spriteSelecionado = this.medalhas[0]; // Medalha 1
    }
    //console.log("Medalha selecionada:", spriteSelecionado);

    if (spriteSelecionado) {
      let x =72 // Centraliza no eixo X
      let y = 191.7; // Ajuste de posição abaixo do placar
      contexto.drawImage(
        sprites,
        spriteSelecionado.spriteX, spriteSelecionado.spriteY,
        spriteSelecionado.largura, spriteSelecionado.altura,
        x, y,
        spriteSelecionado.largura, spriteSelecionado.altura
      );
    }
  }
};

// [Canos]
function criaCanos() {
  const canos = {
    largura: 48,
    altura: 400,
    chao: {
      spriteX: 2,
      spriteY: 169,
    },
    ceu: {
      spriteX: 54,
      spriteY: 169,
    },
    espaco: 80,
    pares: [],
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        // [Cano do Céu]
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        );
        
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canoCeuY
        };
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        };

        // Inicializa a variável para marcar se o cano já foi passado
        if (par.passouCano === undefined) {
          par.passouCano = false;
        }
      });
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      // Verifica colisão com o cano superior
      if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y + canos.altura) {
          return true;
        }
      }

      // Verifica colisão com o cano inferior
      if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }

      return false;
    },
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
          passouCano: false
        });
      }

      canos.pares.forEach(function(par) {
        par.x = par.x - 2;

        if (!par.passouCano && par.x + canos.largura <= globais.flappyBird.x) {
          console.log('Passou por um cano!');
          som_PASSOU.play();
          globais.placar.pontuacao++;
          par.passouCano = true;
        }

        if (canos.temColisaoComOFlappyBird(par)) {
          console.log('Colisão detectada!');
          som_HIT.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if (par.x + canos.largura <= 0) {
          console.log('Cano removido');
          canos.pares.shift();
        }
      });
    }
  };

  return canos;
}

function criaPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '25px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 25);      
    },
    atualiza() {
      const passouOIntervalo = 0;

      if(passouOIntervalo) {
        placar.pontuacao = placar.pontuacao + 1;
      }
    }
  }
  return placar;
}

// [Telas]
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.canos = criaCanos();
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      musicaDeFundo.play();
      musicaDeFundo.currentTime = 0;
    },
    desenha() {
      // Desenha o fundo galaxy cobrindo todo o canvas
      contexto.drawImage(galaxy, 0, 0, canvas.width, canvas.height);
      
      // Desenha os demais elementos
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      nosferrato.desenha();
      globais.canos.desenha();
    },
    click(){ 
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
}

Telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar();
    musicaDeFundo.play();
  },
  desenha() {
    contexto.drawImage(galaxy, 0, 0, canvas.width, canvas.height);
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    globais.placar.atualiza();
  }
};

Telas.GAME_OVER = {
  desenha() {
    mensagemGameOver.desenha();
    // Recupera o melhor placar salvo; se não existir, usa 0
    let bestScore = localStorage.getItem("bestScore");
    bestScore = bestScore ? parseInt(bestScore) : 0;
    
    // Se o placar atual for maior que o melhor salvo, atualiza o localStorage
    if (globais.placar.pontuacao > bestScore) {
      bestScore = globais.placar.pontuacao;
      localStorage.setItem("bestScore", bestScore);
    }
    contexto.fillText(`${bestScore}`, canvas.width / 1.35, 245 );
    medalha.desenha(); // Exibe a medalha correspondente
    contexto.fillText(`${globais.placar.pontuacao}`, canvas.width / 1.35, 200 );
    musicaDeFundo.pause();
    musicaDeFundo.currentTime = 0;
  },
  atualiza() { },
  click() {
    musicaDeFundo.play();
    mudaParaTela(Telas.INICIO);
  }
}

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  frames++;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

// Função para iniciar o jogo quando a imagem galaxy estiver carregada
function iniciarJogo() {
  mudaParaTela(Telas.INICIO);
  requestAnimationFrame(loop);
}
