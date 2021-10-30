function sinal(numero) {
	return numero >= 0 ? '+' : '-'
}

function falsaPosicao() {
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
			elementos.push([iteracao, a, x, b, sinal(f(a)), sinal(f(x)), sinal(f(b)), math.round(a-x, p), math.round(b-x, p), math.round(f(x), p)])
			if (math.abs(b-x) < err || math.abs(a-x) < err) {
				break
			}
			f(a)*f(x) < 0 ? b = x : a = x
			iteracao += 1
		}
	} catch(e) { console.log(e) }
	document.getElementById("iteracaoFalsaPosicao").value = 0
	document.getElementById("divIteracaoFalsaPosicao").style.display = ''
	let cabecalho = ["Iteração", "a", "c", "b", "f(a)", "f(c)", "f(b)", "a-c", "b-c", "f(c)"]
	let opcoes = [{ "name": "Mostrar Gráfico", "action": "graficoFalsaPosicaoDaLinha(this)" }]
	tabela('tabelaFalsaPosicao', cabecalho, elementos, opcoes)
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
	let trace1 = {
		x: [a, b],
		y: [f(a), f(b)],
		type: 'lines'
	}
	if (c > a && c > b)
		trace1 = {
			x: [a, c],
			y: [f(a), 0],
			type: 'lines'
		}
	else if (c < a)
		trace1 = {
			x: [b, c],
			y: [f(b), 0],
			type: 'lines'
		}
	let traces = [
		trace1, {
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
	graficoFx('plotFalsaPosicao', expressao, [inicio, fim], pontos, traces)
}

function graficoFalsaPosicaoDaLinha(elem) {
	const iteracao = parseInt(elem.parentElement.parentElement.children[0].innerText)
	document.getElementById("iteracaoFalsaPosicao").value = iteracao
	graficoFalsaPosicaoDaIteracao()
	window.scrollTo(0, 200)
}
