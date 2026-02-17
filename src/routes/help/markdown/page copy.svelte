<div class="prose prose-slate mx-auto max-w-3xl px-4 py-12">
	<h1>Markdown Basics</h1>

	<p>
		Markdown is a simple way to format text. Instead of clicking buttons, you add symbols around
		your text. It's faster once you know it.
	</p>

	<h2>Text Formatting</h2>

	<table>
		<thead>
			<tr>
				<th>You Type</th>
				<th>You Get</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>**bold**</code></td>
				<td><strong>bold</strong></td>
			</tr>
			<tr>
				<td><code>*italic*</code></td>
				<td><em>italic</em></td>
			</tr>
			<tr>
				<td><code>~~strikethrough~~</code></td>
				<td><del>strikethrough</del></td>
			</tr>
		</tbody>
	</table>

	<h2>Headings</h2>

	<pre><code
			># Heading 1
## Heading 2
### Heading 3</code
		></pre>

	<p>One # is the biggest heading, more # symbols make smaller headings.</p>

	<h2>Links</h2>

	<pre><code>[Link text](https://example.com)</code></pre>

	<p>Text in brackets, URL in parentheses.</p>

	<h2>Lists</h2>

	<h3>Bullet Lists</h3>
	<pre><code
			>- First item
- Second item
- Third item</code
		></pre>

	<h3>Numbered Lists</h3>
	<pre><code
			>1. First item
2. Second item
3. Third item</code
		></pre>

	<p>Tip: You can use <code>1.</code> for every item — Markdown auto-numbers them.</p>

	<h2>Images</h2>

	<pre><code>![Alt text](image-url.jpg)</code></pre>

	<p>Same as links but with a <code>!</code> at the start.</p>

	<h2>Quotes</h2>

	<pre><code
			>> This is a quote
> It can span multiple lines</code
		></pre>

	<p>Use <code>&gt;</code> at the start of each line.</p>

	<h2>Code</h2>

	<h3>Inline Code</h3>
	<p>Use backticks: <code>`code here`</code> becomes <code>code here</code></p>

	<h3>Code Blocks</h3>
	<pre><code
			>```
{`function example() {
return "Hello";
}`}
```</code
		></pre>

	<p>Three backticks before and after.</p>

	<h2>Horizontal Line</h2>

	<pre><code>---</code></pre>

	<p>Three dashes create a line break.</p>

	<h2>Common Mistakes</h2>

	<ul>
		<li>
			<strong>Forgetting spaces:</strong> <code>#Heading</code> won't work, use
			<code># Heading</code>
		</li>
		<li>
			<strong>No blank lines:</strong> Put a blank line before lists and headings or they won't format
		</li>
		<li>
			<strong>Broken links:</strong> Check you closed both brackets and parentheses:
			<code>[text](url)</code>
		</li>
	</ul>

	<h2>Quick Reference</h2>

	<table>
		<tbody>
			<tr>
				<td><code>**bold**</code></td>
				<td><code>*italic*</code></td>
			</tr>
			<tr>
				<td><code># Heading</code></td>
				<td><code>[link](url)</code></td>
			</tr>
			<tr>
				<td><code>- List item</code></td>
				<td><code>![image](url)</code></td>
			</tr>
			<tr>
				<td><code>> Quote</code></td>
				<td><code>`code`</code></td>
			</tr>
		</tbody>
	</table>

	<hr />

	<p>
		<strong>Learn more:</strong>
		<a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">Markdown Cheat Sheet</a>
	</p>
</div>
