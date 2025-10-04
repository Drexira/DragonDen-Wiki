class CodeBlock extends HTMLElement {
    connectedCallback(){
        const title = this.getAttribute('title') || 'Code'
        const language = this.getAttribute('language') || 'plaintext'
        const code = this.innerHTML.trim()
        this.innerHTML = `
      <div class="code-container">
        <div class="code-header">
          <span class="code-title">${title}</span>
          <button class="copy-button">Copy</button>
        </div>
        <pre class="code-block"><code class="language-${language}">${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>
      </div>
    `
        const btn = this.querySelector('.copy-button')
        btn?.addEventListener('click', () => {
            const text = this.querySelector('code')?.innerText || ''
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = 'Copied'
                setTimeout(() => btn.textContent = 'Copy', 1500)
            })
        })
        if (window.Prism) Prism.highlightElement(this.querySelector('code'))
    }
}
customElements.define('code-block', CodeBlock)
