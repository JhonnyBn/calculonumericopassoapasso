function sinal(numero) {
	return numero >= 0 ? '+' : '-'
}

function secante() {
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
	let x0 = document.getElementById("inicioSecante").value
	let x1 = document.getElementById("fimSecante").value
	let err = document.getElementById("errBisseccao").value
	let p = document.getElementById("precisaoSecante").value
	try{
		p = math.round(math.parse(p).evaluate(), 0)
		err = math.parse(err).evaluate()
		x0 = math.round(math.parse(x0).evaluate(), p)
		x1 = math.round(math.parse(x1).evaluate(), p)
		while(true) {
			if(iteracao > 1000) {
				alerta("error", "Excesso de iterações", "Por favor certifique-se que o intervalo especificado contenha uma raiz.")
				return
			}
			let x2 = math.round((x0*f(x1)-x1*f(x0))/(f(x1)-f(x0)), p)
			let parada = math.abs(x2-x1)/math.abs(x2)
			elementos.push([iteracao, x0, x1, x2, math.round(f(x0), p), math.round(f(x1), p), math.round(f(x2), p), math.round(parada, p)])
			if (parada < err) {
				break
			}
			x0 = x1
			x1 = x2
			iteracao += 1
		}
	} catch(e) {  }
	document.getElementById("iteracaoSecante").value = 0
	document.getElementById("divIteracaoSecante").style.display = ''
	let cabecalho = ["Iteração", "$$x_0$$", "$$x_1$$", "$$x_2$$", "$$f(x_0)$$", "$$f(x_1)$$", "$$f(x_2)$$", "$$\\dfrac{x_2-x_1}{x_2}$$"]
	let opcoes = [{ "name": "Mostrar Gráfico", "action": "graficoSecanteDaLinha(this)" }]
	tabela('tabelaSecante', cabecalho, elementos, opcoes)
	MathJax.typeset()
	show("tabelaSecante")
	clearZoom()
	graficoSecanteDaIteracao()
}

function atualizarIteracaoSecante(delta) {
	const iteracao = document.getElementById('iteracaoSecante')
	const max = document.querySelectorAll("#tabelaSecante > table > tbody > tr").length - 1
	let iteracaoN = parseInt(iteracao.value)
	if( iteracaoN + delta >= 0 && iteracaoN + delta <= max )
	{
		iteracao.value = iteracaoN + delta
		iteracao.onchange()
	}
}

function iteracaoChangeSecante() {
	const iteracao = document.getElementById('iteracaoSecante').value
	const max = document.querySelectorAll("#tabelaSecante > table > tbody > tr").length - 1
	if( iteracao < 0 )
		document.getElementById('iteracaoSecante').value = 0
	if ( iteracao > max )
		document.getElementById('iteracaoSecante').value = max
	graficoSecanteDaIteracao()
}

function graficoSecanteDaIteracao() {
	const expressao = document.getElementById('expr').value
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	const inicio = document.getElementById('inicio').value
	const fim = document.getElementById('fim').value
	const iteracao = parseInt(document.getElementById('iteracaoSecante').value)
	const resultado = document.querySelectorAll("#tabelaSecante > table > tbody > tr:nth-child(" + ( iteracao + 1)  + ") > td")
	const x0 = parseFloat(resultado[1].textContent)
	const x1 = parseFloat(resultado[2].textContent)
	const x2 = parseFloat(resultado[3].textContent)
	const pontos = [
		{nome: 'x0', x: x0},
		{nome: 'x1', x: x1},
		{nome: 'x2', x: x2}
	]
	let expressoes = [{
		"expressao": eqReta([x0, f(x0)], [x1, f(x1)]),
		"limites": [Math.min(x0, x1, x2), Math.max(x0, x1, x2)],
		"nome": ''
	}]
	let traces = [{
		x: [x0, x0],
		y: [0, f(x0)],
		type: 'lines',
		name: '',
		line: {
			color: 'gray',
			dash: 'dot'
		}
	}, {
		x: [x1, x1],
		y: [0, f(x1)],
		type: 'lines',
		name: '',
		line: {
			color: 'gray',
			dash: 'dot'
		}
	}, {
		x: [x2, x2],
		y: [0, f(x2)],
		type: 'lines',
		name: '',
		line: {
			color: 'gray',
			dash: 'dot'
		}
	}]
	graficoFx('plotSecante', expressao, [inicio, fim], pontos, traces, expressoes)
}

function graficoSecanteDaLinha(elem) {
	const iteracao = parseInt(elem.parentElement.parentElement.children[0].innerText)
	document.getElementById("iteracaoSecante").value = iteracao
	graficoSecanteDaIteracao()
	window.scrollTo(0, 200)
}
