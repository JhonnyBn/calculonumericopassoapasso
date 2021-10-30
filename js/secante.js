function sinal(numero) {
	return numero >= 0 ? '+' : '-'
}

function secante() {
	const expressao = document.getElementById('expr').value
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	let elementos = []
	let iteracao = 0
	let x0 = document.getElementById("inicioSecante").value
	let x1 = document.getElementById("fimSecante").value
	let p = document.getElementById("precisaoSecante").value
	try{
		p = math.round(math.parse(p).evaluate(), 0)
		err = math.parse('10^-' + p).evaluate()
		x0 = math.round(math.parse(x0).evaluate(), p)
		x1 = math.round(math.parse(x1).evaluate(), p)
		while(true) {
			if(iteracao > 1000) {
				alert('Mais de 1000 iteracoes')
				return
			}
			let x2 = math.round((x1-f(x1)*((x1-x0)/(f(x1)-f(x0)))), p)
			elementos.push([iteracao, x0, x2, x1, sinal(f(x0)), sinal(f(x2)), sinal(f(x1)), math.round(x0-x2, p), math.round(x1-x2, p), math.round(f(x2), p)])
			if (math.abs(x1-x2) < err || math.abs(x0-x2) < err) {
				break
			}
			f(x0)*f(x2) < 0 ? x1 = x2 : x0 = x2
			iteracao += 1
		}
	} catch(e) { console.log(e) }
	document.getElementById("iteracaoSecante").value = 0
	document.getElementById("divIteracaoSecante").style.display = ''
	let cabecalho = ["Iteração", "x0", "x2", "x1", "f(x0)", "f(x2)", "f(x1)", "x0-x2", "x1-x2", "f(x2)"]
	let opcoes = [{ "name": "Mostrar Gráfico", "action": "graficoSecanteDaLinha(this)" }]
	tabela('tabelaSecante', cabecalho, elementos, opcoes)
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
	const x2 = parseFloat(resultado[2].textContent)
	const x1 = parseFloat(resultado[3].textContent)
	const pontos = [
		{nome: 'x0', x: x0},
		{nome: 'x2', x: x2},
		{nome: 'x1', x: x1}
	]
	let trace1 = {
		x: [x0, x1],
		y: [f(x0), f(x1)],
		type: 'lines'
	}
	if (x2 > x0 && x2 > x1)
		trace1 = {
			x: [x0, x2],
			y: [f(x0), 0],
			type: 'lines'
		}
	else if (x2 < x0)
		trace1 = {
			x: [x1, x2],
			y: [f(x1), 0],
			type: 'lines'
		}
	let traces = [
		trace1, {
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
	graficoFx('plotSecante', expressao, [inicio, fim], pontos, traces)
}

function graficoSecanteDaLinha(elem) {
	const iteracao = parseInt(elem.parentElement.parentElement.children[0].innerText)
	document.getElementById("iteracaoSecante").value = iteracao
	graficoSecanteDaIteracao()
	window.scrollTo(0, 200)
}
