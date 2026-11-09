import type { MarkdownRenderer } from 'vitepress'

type RenderRule = NonNullable<MarkdownRenderer['renderer']['rules'][string]>
const mathRenderers = new WeakMap<MarkdownRenderer, RenderRule>()

export default function equationNumbers(md: MarkdownRenderer) {
  // VitePress reuses and reconfigures its Markdown renderer during a build.
  if (!md.renderer.rules.equation_reference) {
    md.inline.ruler.before('escape', 'equation_reference', (state, silent) => {
      if (state.src[state.pos] !== '\\' || state.linkLevel > 0) return false
      const match = state.src.slice(state.pos).match(/^\\eqref\{([^}]+)\}/)
      if (!match) return false

      if (!silent) {
        const token = state.push('equation_reference', '', 0)
        token.content = match[1]
      }
      state.pos += match[0].length
      return true
    })

    md.core.ruler.after('inline', 'equation_numbers', (state) => {
      const equations = new Map<string, number>()

      for (const token of state.tokens) {
        if (token.type !== 'math_block') continue
        const labels = [...token.content.matchAll(/\\label\{([^}]+)\}/g)]
        if (labels.length === 0) continue
        if (labels.length !== 1 || !/^eq-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(labels[0][1])) {
          throw new Error('Each numbered formula needs one label in the form eq-topic-name')
        }

        const id = labels[0][1]
        if (equations.has(id)) throw new Error(`Duplicate formula label: ${id}`)
        const number = equations.size + 1
        equations.set(id, number)
        token.meta = { equationId: id, equationNumber: number }
        token.content = token.content.replace(labels[0][0], '').trim()
      }

      for (const token of state.tokens) {
        for (const child of token.children ?? []) {
          if (child.type !== 'equation_reference') continue
          const number = equations.get(child.content)
          if (number === undefined) throw new Error(`Unknown formula reference: ${child.content}`)
          child.meta = { equationNumber: number }
        }
      }
    })

    md.renderer.rules.equation_reference = (tokens, index) => {
      const token = tokens[index]
      return `<a class="equation-ref" href="#${token.content}" aria-label="跳转到公式 (${token.meta.equationNumber})">(${token.meta.equationNumber})</a>`
    }
  }

  const renderMathBlock = md.renderer.rules.math_block!
  if (renderMathBlock === mathRenderers.get(md)) return

  const numberedMathBlock: RenderRule = (tokens, index, options, env, self) => {
    const formula = renderMathBlock(tokens, index, options, env, self)
    const equation = tokens[index].meta
    if (!equation?.equationId) return formula

    const { equationId: id, equationNumber: number } = equation
    return `<div class="numbered-equation" id="${id}">` +
      `<div class="equation-body">${formula}</div>` +
      `<a class="equation-number" href="#${id}" aria-label="公式 (${number}) 的永久链接">(${number})</a>` +
      '</div>\n'
  }
  mathRenderers.set(md, numberedMathBlock)
  md.renderer.rules.math_block = numberedMathBlock
}
