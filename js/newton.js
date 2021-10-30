function newton() {
	const expressao = document.getElementById('expr').value
	const inicio = Number(document.getElementById('inicio').value)
	const fim = Number(document.getElementById('fim').value)
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	const derivada = math.derivative(funcao, 'x')
	const derivadaCompilada = derivada.compile()
	const derivada3 = (x) => { return derivadaCompilada.evaluate({x: x}) }
	let elementos = []
	let iteracao = 0
	let aprox = document.getElementById("aprox").value
	let err = document.getElementById("errBisseccao").value
	let p = document.getElementById("precisaoNewton").value
	try{
		p = math.round(math.parse(p).evaluate(), 0)
		err = math.parse(err).evaluate()
		x = math.round(math.parse(aprox).evaluate(), p)
		while(true) {
			if(iteracao > 1000) {
				alert('Mais de 1000 iteracoes')
				return
			}
            let y = f(x)
			let x1 = math.round(x - y/derivada3(x), p)
			elementos.push([
                iteracao,
                x,
				x1,
                math.round(Math.abs(f(x1)), p),
                math.round(Math.abs(x1-x), p),
                math.round(f(x), p),
                math.round(derivada3(x), p)
            ])
			if (Math.abs(f(x1)) < err || Math.abs(x1-x) < err)
				break
			x = x1
			iteracao += 1
		}
	} catch(e) { console.log(e) }
	document.getElementById("iteracaoNewton").value = 0
	document.getElementById("divIteracaoNewton").style.display = ''
    let cabecalho = ["Iteração", "x0", "x1", "|f(x1)|", "|x1-x0|", "f(x)", "f'(x)"]
	let opcoes = [{ "name": "Mostrar Gráfico", "action": "graficoNewtonDaLinha(this)" }]
	tabela('tabelaNewton', cabecalho, elementos, opcoes)
	elementosNewton = elementos
    show("tabelaNewton")
	clearZoom()
	graficoNewtonDaIteracao()
}

function atualizarIteracaoNewton(delta) {
	const iteracao = document.getElementById('iteracaoNewton')
	const max = document.querySelectorAll("#tabelaNewton > table > tbody > tr").length - 1
	let iteracaoN = parseInt(iteracao.value)
	if( iteracaoN + delta >= 0 && iteracaoN + delta <= max )
	{
		iteracao.value = iteracaoN + delta
		iteracao.onchange()
	}
}

function iteracaoChangeNewton() {
	const iteracao = document.getElementById('iteracaoNewton').value
	const max = document.querySelectorAll("#tabelaNewton > table > tbody > tr").length - 1
	if( iteracao < 0 )
		document.getElementById('iteracaoNewton').value = 0
	if ( iteracao > max )
		document.getElementById('iteracaoNewton').value = max
	graficoNewtonDaIteracao()
}

function graficoNewtonDaIteracao() {
	const expressao = document.getElementById('expr').value
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	const inicio = document.getElementById('inicio').value
	const fim = document.getElementById('fim').value
	const iteracao = parseInt(document.getElementById('iteracaoNewton').value)
	
	let pontos = []
	let traces = []
	let expressoes = []
	for (etapa of elementosNewton) {
		let xNumero = etapa[0]
		x = etapa[1]
		x1 = etapa[2]
		pontos.push({nome: 'x' + xNumero, x: x})
		expressoes.push({
			"expressao": eqReta([x, f(x)], [x1, 0]),
			"limites": [Math.min(x, x1), Math.max(x, x1)],
			"nome": 'tangente de x' + xNumero
		})
		traces.push({
			x: [x1, x1],
			y: [0, f(x1)],
			type: 'lines',
			name: '',
			line: {
				color: 'gray',
				dash: 'dot'
			}
		})
		if(xNumero >= iteracao) {
			pontos.push({nome: 'x' + (xNumero + 1), x: x1})
			break
		}
	}
	
	graficoFx('plotNewton', expressao, [inicio, fim], pontos, traces, expressoes)
}

function graficoNewtonDaLinha(elem) {
	const iteracao = parseInt(elem.parentElement.parentElement.children[0].innerText)
	document.getElementById("iteracaoNewton").value = iteracao
	graficoNewtonDaIteracao()
	window.scrollTo(0, 200)
}