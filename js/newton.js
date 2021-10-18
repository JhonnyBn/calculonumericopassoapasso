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
	let iteracao = 1
	let aprox = document.getElementById("aprox").value
	let p = document.getElementById("precisaoNewton").value
	try{
		p = math.round(math.parse(p).evaluate(), 0)
		err = math.parse('10^-' + p).evaluate()
		x = math.round(math.parse(aprox).evaluate(), p)
		while(true) {
			if(iteracao > 1000) {
				alert('Mais de 1000 iteracoes')
				return
			}
            let y = f(x)
			let x1 = math.round(x - y/derivada3(x), p)
            //let tan = "("+derivada3(x)+"*(x-"+x+")-"+y+")"
			//let tan = x1 + "x + " + x1
			elementos.push([
                iteracao,
                x1,
                x,
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
    let cabecalho = ["Iteração", "x1", "x0", "|f(x1)|", "|x1-x0|", "f(x)", "f'(x)"]
	tabela('tabelaNewton', cabecalho, elementos)
    show("tabelaNewton")
	clearZoom()
    graficoNewton(elementos)
}

function graficoNewton(elementos) {
    const expressao = document.getElementById('expr').value
	const inicio = document.getElementById('inicio').value
	const fim = document.getElementById('fim').value
	//const iteracao = document.getElementById('iteracaoNewton').value
	//const resultado = document.querySelectorAll("#tabelaNewton > table > tbody > tr:nth-child(" + iteracao + ") > td")
    let pontos = [
        {nome: 'x0', x: elementos[0][2]},
    ]
    let i = 1
    for (linha of elementos) {
        pontos.push({nome: 'x' + i, x: linha[1]})
        i++
    }
	traces = []
	const funcao = math.parse(expressao)
	const funcaoCompilada = funcao.compile()
	let f = (x) => { return funcaoCompilada.evaluate({x: x}) }
	for(i = 1; i < pontos.length; i++) {
		traces.push({
			x: [pontos[i-1].x, pontos[i].x],
			y: [f(pontos[i-1].x), 0],
			type: 'lines'
		})
	}
	graficoFx('plotNewton', expressao, [inicio, fim], pontos, traces)
}