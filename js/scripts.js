document.addEventListener('DOMContentLoaded', () => {
    const linksNav = document.querySelectorAll('nav a');
    const pageAtual = window.location.pathname.split('/').pop() || 'index.html';

    linksNav.forEach(link => {
        if (link.getAttribute('href') === pageAtual) {
            link.classList.add('active');
        }
    });

    const formContato = document.getElementById('formContato');
    if (formContato) {
        inicializarFormulario(formContato);
    }

    const canvas = document.getElementById('meuCanvas');
    if (canvas) {
        renderizarCanvas(canvas);
    }
});

function inicializarFormulario(form) {
    const feedbackContainer = document.getElementById('feedbackFormulario');

    carregarDadosSalvos(form);
    exibirMensagensSalvas();

    form.addEventListener('input', () => {
        const dadosForm = getDadosFormulario(form);
        localStorage.setItem('cp3_rascunho_form', JSON.stringify(dadosForm));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        feedbackContainer.className = 'feedback-box';
        feedbackContainer.textContent = '';
        limparErrosFormulario(form);

        const nome = form.querySelector('#nome').value.trim();
        const email = form.querySelector('#email').value.trim();
        const tel = form.querySelector('#tel').value.trim();
        const mensagem = form.querySelector('#mensagem').value.trim();
        const cor = form.querySelector('#cor').value;

        let erros = [];

        if (nome.length < 3) {
            exibirErroCampo(form.querySelector('#nome'), 'O nome deve ter no mínimo 3 caracteres.');
            erros.push('Nome inválido');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            exibirErroCampo(form.querySelector('#email'), 'Insira um e-mail válido.');
            erros.push('E-mail inválido');
        }

        if (tel !== '') {
            const telRegex = /^[0-9]{2} [0-9]{5}-[0-9]{4}$/;
            if (!telRegex.test(tel)) {
                exibirErroCampo(form.querySelector('#tel'), 'Use o formato correto: 11 99999-9999');
                erros.push('Telefone inválido');
            }
        }

        if (erros.length > 0) {
            feedbackContainer.classList.add('erro');
            feedbackContainer.textContent = 'Por favor, corrija os erros no formulário antes de enviar.';
            return;
        }

        const novaMensagem = {
            id: Date.now(),
            nome,
            email,
            mensagem,
            cor,
            data: new Date().toLocaleDateString('pt-BR')
        };

        salvarMensagemLocalStorage(novaMensagem);
        localStorage.removeItem('cp3_rascunho_form');
        form.reset();

        feedbackContainer.classList.add('sucesso');
        feedbackContainer.textContent = 'Mensagem enviada e salva com sucesso no localStorage!';
        
        exibirMensagensSalvas();
    });
}

function exibirErroCampo(input, mensagem) {
    input.classList.add('campo-erro');
    const msg = document.createElement('span');
    msg.className = 'msg-erro-campo';
    msg.textContent = mensagem;
    input.insertAdjacentElement('afterend', msg);
}

function limparErrosFormulario(form) {
    form.querySelectorAll('.campo-erro').forEach(el => el.classList.remove('campo-erro'));
    form.querySelectorAll('.msg-erro-campo').forEach(el => el.remove());
}

function getDadosFormulario(form) {
    return {
        nome: form.querySelector('#nome').value,
        email: form.querySelector('#email').value,
        tel: form.querySelector('#tel').value,
        nasc: form.querySelector('#nasc').value,
        cor: form.querySelector('#cor').value,
        mensagem: form.querySelector('#mensagem').value
    };
}

function carregarDadosSalvos(form) {
    const rascunho = localStorage.getItem('cp3_rascunho_form');
    if (rascunho) {
        const dados = JSON.parse(rascunho);
        if (dados.nome) form.querySelector('#nome').value = dados.nome;
        if (dados.email) form.querySelector('#email').value = dados.email;
        if (dados.tel) form.querySelector('#tel').value = dados.tel;
        if (dados.nasc) form.querySelector('#nasc').value = dados.nasc;
        if (dados.cor) form.querySelector('#cor').value = dados.cor;
        if (dados.mensagem) form.querySelector('#mensagem').value = dados.mensagem;
    }
}

function salvarMensagemLocalStorage(msg) {
    const msgs = JSON.parse(localStorage.getItem('cp3_mensagens_enviadas') || '[]');
    msgs.unshift(msg);
    localStorage.setItem('cp3_mensagens_enviadas', JSON.stringify(msgs));
}

function exibirMensagensSalvas() {
    const container = document.getElementById('historicoMensagens');
    if (!container) return;

    const msgs = JSON.parse(localStorage.getItem('cp3_mensagens_enviadas') || '[]');
    
    if (msgs.length === 0) {
        container.innerHTML = '<p>Nenhuma mensagem enviada ainda.</p>';
        return;
    }

    container.innerHTML = msgs.map(m => `
        <div style="border-left: 4px solid ${m.cor}; background: #ffffff; padding: 10px; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <strong>${m.nome}</strong> (${m.email}) - <small>${m.data}</small>
            <p style="margin-top: 5px;">${m.mensagem}</p>
        </div>
    `).join('');
}

function renderizarCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 300, 0);
    gradient.addColorStop(0, '#0c4a6e');
    gradient.addColorStop(1, '#0284c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(10, 10, 280, 160);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Canvas Renderizado!', 150, 60);

    ctx.beginPath();
    ctx.arc(150, 110, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
}