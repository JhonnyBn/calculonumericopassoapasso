function sinal(numero) {
	return numero >= 0 ? '+' : '-'
}

function falsaPosicao() {
	if(!funcaoValida()) {
		alerta("error", "Erro na Função", "Por favor certifique-se que a função f(x) está digitada corretamente antes de calcular o método.")
		return
	}
	const expressao = document.getElementById('expr').value
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	let elementos = []
	let iteracao = 0
	let a = document.getElementById("inicioFalsaPosicao").value
	let b = document.getElementById("fimFalsaPosicao").value
	let err = document.getElementById("errFalsaPosicao").value
	let p = document.getElementById("precisaoFalsaPosicao").value
	try{
		p = math.round(math.parse(p).evaluate(), 0)
		err = math.parse(err).evaluate()
		a = math.round(math.parse(a).evaluate(), p)
		b = math.round(math.parse(b).evaluate(), p)
		while(true) {
			if(iteracao > 1000) {
				alert('Mais de 1000 iteracoes')
				return
			}
			let x = math.round(((a*f(b)-b*f(a))/(f(b)-f(a))), p)
			let parada0 = math.abs(x-a)/math.abs(x)
			let parada1 = math.abs(x-b)/math.abs(x)
			elementos.push([iteracao, a, x, b, sinal(f(a)), sinal(f(x)), sinal(f(b)), math.round(parada0, p), math.round(parada1, p), math.round(f(x), p)])
			if (f(x) === 0 || parada0 < err || parada1 < err) {
				break
			}
			f(a)*f(x) < 0 ? b = x : a = x
			iteracao += 1
		}
	} catch(e) { console.log(e) }
	document.getElementById("iteracaoFalsaPosicao").value = 0
	document.getElementById("divIteracaoFalsaPosicao").style.display = ''
	let cabecalho = ["Iteração", "$$a$$", "$$c$$", "$$b$$", "$$f(a)$$", "$$f(c)$$", "$$f(b)$$", "$$\\dfrac{c-a}{c}$$", "$$\\dfrac{c-b}{c}$$", "$$f(c)$$"]
	let opcoes = [{ "name": "Mostrar Gráfico", "action": "graficoFalsaPosicaoDaLinha(this)" }]
	tabela('tabelaFalsaPosicao', cabecalho, elementos, opcoes)
	MathJax.typeset()
	show("tabelaFalsaPosicao")
	clearZoom()
	graficoFalsaPosicaoDaIteracao()
}

function atualizarIteracaoFalsaPosicao(delta) {
	const iteracao = document.getElementById('iteracaoFalsaPosicao')
	const max = document.querySelectorAll("#tabelaFalsaPosicao > table > tbody > tr").length - 1
	let iteracaoN = parseInt(iteracao.value)
	if( iteracaoN + delta >= 0 && iteracaoN + delta <= max )
	{
		iteracao.value = iteracaoN + delta
		iteracao.onchange()
	}
}

function iteracaoChangeFalsaPosicao() {
	const iteracao = document.getElementById('iteracaoFalsaPosicao').value
	const max = document.querySelectorAll("#tabelaFalsaPosicao > table > tbody > tr").length - 1
	if( iteracao < 0 )
		document.getElementById('iteracaoFalsaPosicao').value = 0
	if ( iteracao > max )
		document.getElementById('iteracaoFalsaPosicao').value = max
	graficoFalsaPosicaoDaIteracao()
}

function graficoFalsaPosicaoDaIteracao() {
	const expressao = document.getElementById('expr').value
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	const inicio = document.getElementById('inicio').value
	const fim = document.getElementById('fim').value
	const iteracao = parseInt(document.getElementById('iteracaoFalsaPosicao').value)
	const resultado = document.querySelectorAll("#tabelaFalsaPosicao > table > tbody > tr:nth-child(" + ( iteracao + 1)  + ") > td")
	const a = parseFloat(resultado[1].textContent)
	const c = parseFloat(resultado[2].textContent)
	const b = parseFloat(resultado[3].textContent)
	const pontos = [
		{nome: 'a', x: a},
		{nome: 'c', x: c},
		{nome: 'b', x: b}
	]
	let expressoes = [{
		"expressao": eqReta([a, f(a)], [b, f(b)]),
		"limites": [Math.min(a, b, c), Math.max(a, b, c)],
		"nome": ''
	}]
	let traces = [{
		x: [a, a],
		y: [0, f(a)],
		type: 'lines',
		name: '',
		line: {
			color: 'gray',
			dash: 'dot'
		}
	}, {
		x: [b, b],
		y: [0, f(b)],
		type: 'lines',
		name: '',
		line: {
			color: 'gray',
			dash: 'dot'
		}
	}, {
		x: [c, c],
		y: [0, f(c)],
		type: 'lines',
		name: '',
		line: {
			color: 'gray',
			dash: 'dot'
		}
	}]
	graficoFx('plotFalsaPosicao', expressao, [inicio, fim], pontos, traces, expressoes)
}

function graficoFalsaPosicaoDaLinha(elem) {
	const iteracao = parseInt(elem.parentElement.parentElement.children[0].innerText)
	document.getElementById("iteracaoFalsaPosicao").value = iteracao
	graficoFalsaPosicaoDaIteracao()
	window.scrollTo(0, 200)
}
