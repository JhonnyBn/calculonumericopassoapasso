function sinal(numero) {
	return numero >= 0 ? '+' : '-'
}

function bisseccao() {
	const expressao = document.getElementById('expr').value
	const inicio = document.getElementById('inicioBisseccao').value
	const fim = document.getElementById('fimBisseccao').value
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	let elementos = []
	let iteracao = 1
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
			elementos.push([iteracao, a, b, x, sinal(f(a)), sinal(f(b)), sinal(f(x)), math.round(b-x, p), math.round(f(x), p)])
			if ((b-x) < err)
				break
			f(a)*f(x) < 0 ? b = x : a = x
			iteracao += 1
		}
	} catch(e) {}
	document.getElementById("iteracaoBisseccao").value = 1
	document.getElementById("divIteracaoBisseccao").style.display = ''
	let cabecalho = ["Iteração", "a", "b", "c", "f(a)", "f(b)", "f(c)", "b-c", "f(c)"]
	let opcoes = [{ "name": "Mostrar Gráfico", "action": "graficoBisseccaoDaLinha(this)" }]
	tabela('tabelaBisseccao', cabecalho, elementos, opcoes)
	show("tabelaBisseccao")
	graficoBisseccaoDaIteracao()
}

function atualizarIteracao(delta) {
	const iteracao = document.getElementById('iteracaoBisseccao')
	let iteracaoN = parseInt(iteracao.value)
	if( iteracaoN + delta > 0 )
	{
		iteracao.value = iteracaoN + delta
		iteracao.onchange()
	}
}

function graficoBisseccaoDaIteracao() {
	const expressao = document.getElementById('expr').value
	const inicio = document.getElementById('inicioBisseccao').value
	const fim = document.getElementById('fimBisseccao').value
	const iteracao = document.getElementById('iteracaoBisseccao').value
	const resultado = document.querySelectorAll("#tabelaBisseccao > table > tbody > tr:nth-child(" + iteracao + ") > td")
	const a = math.parse(resultado[1].textContent).value
	const b = math.parse(resultado[2].textContent).value
	const c = math.parse(resultado[3].textContent).value
	const pontos = [
		{nome: 'a', x: a},
		{nome: 'b', x: b},
		{nome: 'c', x: c}
	]
	graficoFx('plotBisseccao', expressao, [inicio, fim], pontos)
}

function graficoBisseccaoDaLinha(elem) {
	const iteracao = parseInt(elem.parentElement.parentElement.children[0].innerText)
	document.getElementById("iteracaoBisseccao").value = iteracao
	graficoBisseccaoDaIteracao()
	window.scrollTo(0, 200)
}
