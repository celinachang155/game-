// Lista das 10 rodadas com dificuldade progressiva (multiplicação, divisão, potenciação e raiz quadrada)
const bancoDePerguntas = [
  {
    categoria: "Multiplicação",
    pergunta: "Quanto é 6 × 7?",
    opcoes: ["42", "36", "48", "49"],
    correta: "42",
    explicacao: "6 grupos de 7 somam 42 (6 × 7 = 42)."
  },
  {
    categoria: "Divisão",
    pergunta: "Quanto é 56 ÷ 8?",
    opcoes: ["7", "6", "8", "9"],
    correta: "7",
    explicacao: "Como 8 × 7 = 56, dividir 56 por 8 dá 7."
  },
  {
    categoria: "Multiplicação",
    pergunta: "Quanto é 12 × 9?",
    opcoes: ["108", "98", "112", "96"],
    correta: "108",
    explicacao: "12 × 10 é 120; tirando um 12, chegamos a 108."
  },
  {
    categoria: "Divisão",
    pergunta: "Quanto é 144 ÷ 12?",
    opcoes: ["12", "11", "14", "10"],
    correta: "12",
    explicacao: "12 × 12 = 144, então o resultado da divisão é 12."
  },
  {
    categoria: "Potenciação",
    pergunta: "Quanto é 5² (5 elevado a 2)?",
    opcoes: ["25", "10", "15", "32"],
    correta: "25",
    explicacao: "5² significa 5 × 5, que é igual a 25 (não 5 × 2)."
  },
  {
    categoria: "Potenciação",
    pergunta: "Quanto é 2⁴ (2 elevado a 4)?",
    opcoes: ["16", "8", "12", "6"],
    correta: "16",
    explicacao: "2⁴ = 2 × 2 × 2 × 2 = 16."
  },
  {
    categoria: "Raiz Quadrada",
    pergunta: "Qual é a raiz quadrada de 49 (√49)?",
    opcoes: ["7", "6", "8", "24"],
    correta: "7",
    explicacao: "√49 = 7 porque 7 × 7 = 49."
  },
  {
    categoria: "Potenciação",
    pergunta: "Quanto é 3³ (3 elevado a 3)?",
    opcoes: ["27", "9", "18", "81"],
    correta: "27",
    explicacao: "3³ = 3 × 3 × 3 = 9 × 3 = 27."
  },
  {
    categoria: "Raiz Quadrada",
    pergunta: "Qual é a raiz quadrada de 121 (√121)?",
    opcoes: ["11", "12", "13", "21"],
    correta: "11",
    explicacao: "√121 = 11 porque 11 × 11 = 121."
  },
  {
    categoria: "Desafio Final: Raiz e Potência",
    pergunta: "Quanto é √81 + 2³?",
    opcoes: ["17", "15", "18", "14"],
    correta: "17",
    explicacao: "√81 = 9 e 2³ = 8. Somando os dois: 9 + 8 = 17."
  }
];

// Variáveis de estado do jogo
let rodadaAtual = 0;
let pontos = 0;
let acertos = 0;
let vidas = 4;
let tempoInicio = 0;
const pontosPorAcerto = 100;
const pontuacaoMaxima = bancoDePerguntas.length * pontosPorAcerto;

// Pegando os elementos da tela (HTML)
const telaInicio = document.getElementById("tela-inicio");
const telaJogo = document.getElementById("tela-jogo");
const telaFim = document.getElementById("tela-fim");

const indicadorRodada = document.getElementById("indicador-rodada");
const valorVidas = document.getElementById("valor-vidas");
const valorPontos = document.getElementById("valor-pontos");
const barraProgresso = document.getElementById("barra-progresso");
const barraProgressoContainer = document.getElementById("barra-progresso-container");

const etiquetaCategoria = document.getElementById("etiqueta-categoria");
const textoPergunta = document.getElementById("texto-pergunta");
const gradeBaloes = document.getElementById("grade-baloes");

const caixaFeedback = document.getElementById("caixa-feedback");
const textoFeedback = document.getElementById("texto-feedback");
const botaoProximo = document.getElementById("botao-proximo");

const botaoComecar = document.getElementById("botao-comecar");
const botaoReiniciar = document.getElementById("botao-reiniciar");
const botaoTema = document.getElementById("botao-tema");

// Função para embaralhar as opções dos balões
function embaralharLista(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Atualiza os corações de vida, os pontos e a barra de progresso
function atualizarPainel() {
  const coracoesCheios = "❤️".repeat(Math.max(0, vidas));
  const coracoesVazios = "🤍".repeat(Math.max(0, 4 - vidas));
  valorVidas.textContent = coracoesCheios + coracoesVazios;
  valorPontos.textContent = pontos;

  const numeroExibido = Math.min(rodadaAtual + 1, bancoDePerguntas.length);
  indicadorRodada.textContent = `Rodada ${numeroExibido} de ${bancoDePerguntas.length}`;

  const porcentagem = (rodadaAtual / bancoDePerguntas.length) * 100;
  barraProgresso.style.width = `${porcentagem}%`;
  barraProgressoContainer.setAttribute("aria-valuenow", rodadaAtual);
}

// Inicia ou reinicia o jogo
function iniciarJogo() {
  rodadaAtual = 0;
  pontos = 0;
  acertos = 0;
  vidas = 4;
  tempoInicio = Date.now();

  telaInicio.classList.add("oculto");
  telaFim.classList.add("oculto");
  telaJogo.classList.remove("oculto");

  atualizarPainel();
  carregarRodada();
  notificarAlturaPortal();
}

// Mostra a pergunta atual e cria os 4 balões na tela
function carregarRodada() {
  const questao = bancoDePerguntas[rodadaAtual];

  etiquetaCategoria.textContent = questao.categoria;
  textoPergunta.textContent = questao.pergunta;
  caixaFeedback.classList.add("oculto");
  caixaFeedback.classList.remove("acerto", "erro");
  gradeBaloes.innerHTML = "";

  const opcoesEmbaralhadas = embaralharLista(questao.opcoes);

  opcoesEmbaralhadas.forEach((opcao, indice) => {
    const botaoBalao = document.createElement("button");
    botaoBalao.type = "button";
    botaoBalao.className = `balao balao-${indice}`;
    botaoBalao.textContent = opcao;
    botaoBalao.setAttribute("aria-label", `Balão com resposta ${opcao}`);

    botaoBalao.addEventListener("click", () => {
      verificarResposta(opcao, botaoBalao);
    });

    gradeBaloes.appendChild(botaoBalao);
  });

  notificarAlturaPortal();
}

// Verifica se o balão clicado está certo ou errado
function verificarResposta(respostaEscolhida, balaoClicado) {
  const questao = bancoDePerguntas[rodadaAtual];
  const todosBaloes = gradeBaloes.querySelectorAll(".balao");

  // Trava todos os balões para o jogador não clicar duas vezes
  todosBaloes.forEach((balao) => {
    balao.disabled = true;
    if (balao.textContent === questao.correta) {
      balao.classList.add("correto");
    }
  });

  if (respostaEscolhida === questao.correta) {
    pontos += pontosPorAcerto;
    acertos += 1;
    caixaFeedback.classList.add("acerto");
    textoFeedback.textContent = `Acertou! +${pontosPorAcerto} pontos. ${questao.explicacao}`;
  } else {
    vidas -= 1;
    balaoClicado.classList.add("errado");
    caixaFeedback.classList.add("erro");
    textoFeedback.textContent = `Ops! A resposta certa era ${questao.correta}. ${questao.explicacao}`;
  }

  atualizarPainel();

  // Ajusta o texto do botão conforme a situação do jogo
  if (vidas <= 0) {
    botaoProximo.textContent = "Ver Resultado";
  } else if (rodadaAtual + 1 >= bancoDePerguntas.length) {
    botaoProximo.textContent = "Finalizar Jogo";
  } else {
    botaoProximo.textContent = "Próxima Rodada";
  }

  caixaFeedback.classList.remove("oculto");
  notificarAlturaPortal();
}

// Avança para a próxima pergunta ou encerra o jogo
function avancarRodada() {
  if (vidas <= 0) {
    finalizarJogo(false);
    return;
  }

  rodadaAtual += 1;

  if (rodadaAtual >= bancoDePerguntas.length) {
    barraProgresso.style.width = "100%";
    finalizarJogo(true);
  } else {
    atualizarPainel();
    carregarRodada();
  }
}

// Mostra a tela final e envia o resultado para o portal da escola
function finalizarJogo(venceu) {
  telaJogo.classList.add("oculto");
  telaFim.classList.remove("oculto");

  const iconeFinal = document.getElementById("icone-final");
  const tituloFinal = document.getElementById("titulo-final");
  const mensagemFinal = document.getElementById("mensagem-final");
  const pontosFinais = document.getElementById("pontos-finais");
  const acertosFinais = document.getElementById("acertos-finais");

  if (venceu) {
    iconeFinal.textContent = "🏆";
    tituloFinal.textContent = "Mandou muito bem!";
    mensagemFinal.textContent = "Você venceu o desafio do Douringo e chegou até o fim!";
  } else {
    iconeFinal.textContent = "💜";
    tituloFinal.textContent = "Fim das vidas!";
    mensagemFinal.textContent = "Suas 4 vidas acabaram, mas você já treinou bastante. Tente de novo!";
  }

  pontosFinais.textContent = pontos;
  acertosFinais.textContent = `${acertos} / ${bancoDePerguntas.length}`;

  const tempoEmMs = Date.now() - tempoInicio;

  // Contrato com o portal: envia pontuação e tempo ao terminar
  window.parent.postMessage(
    {
      type: "vrgame:finish",
      score: pontos,
      maxScore: pontuacaoMaxima,
      timeMs: tempoEmMs,
      detail: { jogo: "douringo" }
    },
    "*"
  );

  notificarAlturaPortal();
}

// Alterna entre tema claro e escuro
function aplicarTema(tema) {
  if (tema === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    botaoTema.textContent = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    botaoTema.textContent = "🌙";
  }
}

botaoTema.addEventListener("click", () => {
  const estaEscuro = document.documentElement.getAttribute("data-theme") === "dark";
  aplicarTema(estaEscuro ? "light" : "dark");
});

botaoComecar.addEventListener("click", iniciarJogo);
botaoProximo.addEventListener("click", avancarRodada);
botaoReiniciar.addEventListener("click", iniciarJogo);

// --- INTEGRAÇÃO COM O PORTAL DA ESCOLA ---

// Avisa o portal qual é a altura atual do jogo
function notificarAlturaPortal() {
  const altura = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "vrgame:resize", height: altura }, "*");
}

// Escuta comandos de tema e tela cheia vindos do portal
window.addEventListener("message", (evento) => {
  const dados = evento.data;
  if (!dados || typeof dados !== "object") return;

  if (dados.type === "vrgame:theme") {
    aplicarTema(dados.theme === "dark" ? "dark" : "light");
  }

  if (dados.type === "vrgame:fullscreen") {
    if (dados.fullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else if (!dados.fullscreen && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }
});

// Observa mudanças de tamanho da janela para avisar o portal
window.addEventListener("resize", notificarAlturaPortal);

// Avisa o portal assim que o jogo terminar de carregar
window.addEventListener("DOMContentLoaded", () => {
  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  notificarAlturaPortal();
});