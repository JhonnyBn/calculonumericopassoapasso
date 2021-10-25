function sinal(numero) {
	return numero >= 0 ? '+' : '-'
}

function bisseccao() {
	const expressao = document.getElementById('expr').value
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	let elementos = []
	let iteracao = 0
	let a = document.getElementById("inicioBisseccao").value
	let b = document.getElementById("fimBisseccao").value
	let p = document.getElementById("precisaoBisseccao").value
	try{
		p = math.round(math.parse(p).evaluate(), 0)
		err = math.parse('10^-' + p).evaluate()
		a = math.round(math.parse(a).evaluate(), p)
		b = math.round(math.parse(b).evaluate(), p)
		while(true) {
			if(iteracao > 1000) {
				alert('Mais de 1000 iteracoes')
				return
			}
			let x = math.round((a+b)*0.5, p)
			elementos.push([iteracao, a, x, b, sinal(f(a)), sinal(f(x)), sinal(f(b)), math.round(b-x, p), math.round(f(x), p)])
			if ((b-x) < err) {
				break
			}
			f(a)*f(x) < 0 ? b = x : a = x
			iteracao += 1
		}
	} catch(e) { console.log(e) }
	document.getElementById("iteracaoBisseccao").value = 0
	document.getElementById("divIteracaoBisseccao").style.display = ''
	let cabecalho = ["Iteração", "a", "c", "b", "f(a)", "f(c)", "f(b)", "b-c", "f(c)"]
	let opcoes = [{ "name": "Mostrar Gráfico", "action": "graficoBisseccaoDaLinha(this)" }]
	tabela('tabelaBisseccao', cabecalho, elementos, opcoes)
	show("tabelaBisseccao")
	clearZoom()
	graficoBisseccaoDaIteracao()
}

function atualizarIteracaoBisseccao(delta) {
	const iteracao = document.getElementById('iteracaoBisseccao')
	const max = document.querySelectorAll("#tabelaBisseccao > table > tbody > tr").length - 1
	let iteracaoN = parseInt(iteracao.value)
	if( iteracaoN + delta >= 0 && iteracaoN + delta <= max )
	{
		iteracao.value = iteracaoN + delta
		iteracao.onchange()
	}
}

function iteracaoChangeBisseccao() {
	const iteracao = document.getElementById('iteracaoBisseccao').value
	const max = document.querySelectorAll("#tabelaBisseccao > table > tbody > tr").length - 1
	if( iteracao < 0 )
		document.getElementById('iteracaoBisseccao').value = 0
	if ( iteracao > max )
		document.getElementById('iteracaoBisseccao').value = max
	graficoBisseccaoDaIteracao()
}

function graficoBisseccaoDaIteracao() {
	const expressao = document.getElementById('expr').value
	const inicio = document.getElementById('inicio').value
	const fim = document.getElementById('fim').value
	const iteracao = parseInt(document.getElementById('iteracaoBisseccao').value)
	const resultado = document.querySelectorAll("#tabelaBisseccao > table > tbody > tr:nth-child(" + ( iteracao + 1 ) + ") > td")
	const a = parseFloat(resultado[1].textContent)
	const c = parseFloat(resultado[2].textContent)
	const b = parseFloat(resultado[3].textContent)
	const pontos = [
		{nome: 'a', x: a},
		{nome: 'c', x: c},
		{nome: 'b', x: b}
	]
	graficoFx('plotBisseccao', expressao, [inicio, fim], pontos)
}

function graficoBisseccaoDaLinha(elem) {
	const iteracao = parseInt(elem.parentElement.parentElement.children[0].innerText)
	document.getElementById("iteracaoBisseccao").value = iteracao
	graficoBisseccaoDaIteracao()
	window.scrollTo(0, 200)
}
