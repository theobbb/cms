<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	<div class="mx-auto max-w-4xl px-6 py-12">
		<!-- Header -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h1 class="mb-4 text-4xl font-bold text-gray-900">Markdown Basics</h1>
			<p class="text-lg leading-relaxed text-gray-600">
				Markdown is a simple way to format text without complex tools. Instead of clicking buttons,
				you add symbols around your text. It's like texting shortcuts for formatting—once you learn
				it, it's faster than using a mouse!
			</p>
			<div class="mt-6 rounded border-l-4 border-blue-500 bg-blue-50 p-4">
				<p class="text-sm text-blue-800">
					<strong>💡 Pro tip:</strong> You can practice Markdown in apps like Notion, Discord, Reddit,
					GitHub, and many note-taking apps.
				</p>
			</div>
		</div>

		<!-- Text Formatting -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				✍️ Text Formatting
			</h2>
			<div class="space-y-4">
				<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
					<code class="rounded bg-gray-800 px-3 py-1 font-mono text-sm text-green-400"
						>**bold**</code
					>
					<span class="text-2xl">→</span>
					<strong class="text-lg">bold</strong>
				</div>
				<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
					<code class="rounded bg-gray-800 px-3 py-1 font-mono text-sm text-green-400"
						>*italic*</code
					>
					<span class="text-2xl">→</span>
					<em class="text-lg">italic</em>
				</div>
				<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
					<code class="rounded bg-gray-800 px-3 py-1 font-mono text-sm text-green-400"
						>~~strikethrough~~</code
					>
					<span class="text-2xl">→</span>
					<del class="text-lg">strikethrough</del>
				</div>
			</div>
			<p class="mt-4 text-sm text-gray-600 italic">
				Remember: Two asterisks for bold, one for italic. You can also use underscores (_) instead
				of asterisks.
			</p>
		</div>

		<!-- Headings -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				📋 Headings
			</h2>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				# Big Heading (Heading 1)<br />
				## Medium Heading (Heading 2)<br />
				### Smaller Heading (Heading 3)<br />
				#### Even Smaller (Heading 4)
			</div>
			<p class="leading-relaxed text-gray-700">
				One # symbol makes the biggest heading. Add more # symbols to make headings smaller. Think
				of it like outline levels—the more #'s, the deeper you go.
			</p>
			<div class="mt-4 rounded border-l-4 border-yellow-500 bg-yellow-50 p-4">
				<p class="text-sm text-yellow-800">
					<strong>⚠️ Don't forget:</strong> Always put a space after the # symbols, like
					<code class="rounded bg-yellow-100 px-1"># Title</code>
				</p>
			</div>
		</div>

		<!-- Links -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				🔗 Links
			</h2>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				[Click here](https://example.com)
			</div>
			<p class="mb-4 leading-relaxed text-gray-700">
				Put the text people will click in <strong>square brackets [ ]</strong>, then put the web
				address in <strong>parentheses ( )</strong> right after it—no space between them.
			</p>
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="mb-2 text-sm text-gray-600"><strong>Example:</strong></p>
				<code class="font-mono text-sm">[Visit Google](https://google.com)</code>
				<p class="mt-2 text-sm text-gray-600">
					becomes → <a href="https://google.com" class="text-blue-600 underline">Visit Google</a>
				</p>
			</div>
		</div>

		<!-- Lists -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				📝 Lists
			</h2>

			<h3 class="mb-3 text-xl font-semibold text-gray-800">Bullet Lists</h3>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				- First item<br />
				- Second item<br />
				- Third item
			</div>
			<p class="mb-6 text-gray-700">
				Use a dash (-) or asterisk (*) followed by a space. You can also use a plus sign (+).
			</p>

			<h3 class="mb-3 text-xl font-semibold text-gray-800">Numbered Lists</h3>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				1. First step<br />
				2. Second step<br />
				3. Third step
			</div>
			<div class="rounded border-l-4 border-blue-500 bg-blue-50 p-4">
				<p class="text-sm text-blue-800">
					<strong>💡 Time-saver:</strong> You can actually type
					<code class="rounded bg-blue-100 px-1">1.</code>
					for every item and Markdown will number them automatically!
				</p>
			</div>
		</div>

		<!-- Images -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				🖼️ Images
			</h2>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				![Description of image](https://example.com/image.jpg)
			</div>
			<p class="leading-relaxed text-gray-700">
				Images work just like links, but with an exclamation mark (!) at the start. The text in
				brackets is the "alt text" (description for screen readers and if the image doesn't load).
			</p>
		</div>

		<!-- Quotes -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				💬 Quotes
			</h2>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				> This is a quote<br />
				> It can span multiple lines
			</div>
			<p class="mb-4 leading-relaxed text-gray-700">
				Put a greater-than symbol (>) at the start of each line you want to quote.
			</p>
			<div class="rounded border-l-4 border-gray-400 bg-gray-100 p-4">
				<p class="text-gray-700 italic">This is what your quote will look like</p>
			</div>
		</div>

		<!-- Code -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">💻 Code</h2>

			<h3 class="mb-3 text-xl font-semibold text-gray-800">Inline Code</h3>
			<p class="mb-3 text-gray-700">
				Use backticks (the key above Tab, looks like `) to make text look like code:
			</p>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				Use `code here` for inline code
			</div>
			<p class="mb-6 text-sm text-gray-600">
				Result: Use <code class="rounded bg-gray-200 px-2 py-1">code here</code> for inline code
			</p>

			<h3 class="mb-3 text-xl font-semibold text-gray-800">Code Blocks</h3>
			<p class="mb-3 text-gray-700">
				For multiple lines of code, use three backticks (```) before and after:
			</p>
			<div class="rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">
				```<br />
				function example() &#10100;
				<br />
				&nbsp;&nbsp;return "Hello";<br />
				&#10101;`&#10101;
				<br />
				```
			</div>
		</div>

		<!-- Horizontal Line -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				➖ Horizontal Line
			</h2>
			<div class="mb-4 rounded-lg bg-gray-800 p-4 font-mono text-sm text-green-400">---</div>
			<p class="mb-4 leading-relaxed text-gray-700">
				Three dashes (or asterisks or underscores) create a horizontal line to separate sections.
			</p>
			<hr class="border-t-2 border-gray-300" />
		</div>

		<!-- Common Mistakes -->
		<div class="mb-8 rounded-2xl border-2 border-red-200 bg-red-50 p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-red-300 pb-3 text-2xl font-bold text-red-900">
				⚠️ Common Mistakes to Avoid
			</h2>
			<div class="space-y-4">
				<div class="rounded-lg bg-white p-4">
					<h3 class="mb-2 font-semibold text-red-800">Forgetting spaces</h3>
					<p class="mb-2 text-sm text-gray-700">
						❌ <code class="rounded bg-gray-200 px-2 py-1">#Heading</code> won't work
					</p>
					<p class="text-sm text-gray-700">
						✅ <code class="rounded bg-gray-200 px-2 py-1"># Heading</code> will work
					</p>
				</div>
				<div class="rounded-lg bg-white p-4">
					<h3 class="mb-2 font-semibold text-red-800">No blank lines</h3>
					<p class="text-sm text-gray-700">
						Always put a blank line before headings, lists, quotes, and code blocks, or they might
						not format correctly.
					</p>
				</div>
				<div class="rounded-lg bg-white p-4">
					<h3 class="mb-2 font-semibold text-red-800">Broken links</h3>
					<p class="text-sm text-gray-700">
						Make sure you have both square brackets AND parentheses with no spaces:
						<code class="rounded bg-gray-200 px-2 py-1">[text](url)</code>
					</p>
				</div>
			</div>
		</div>

		<!-- Quick Reference -->
		<div class="mb-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-indigo-300 pb-3 text-2xl font-bold text-gray-900">
				⚡ Quick Reference Card
			</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm">**bold**</code>
				</div>
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm">*italic*</code>
				</div>
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm"># Heading</code>
				</div>
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm">[link](url)</code>
				</div>
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm">- List item</code>
				</div>
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm">![image](url)</code>
				</div>
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm">> Quote</code>
				</div>
				<div class="rounded-lg bg-white p-3 shadow-sm">
					<code class="font-mono text-sm">`code`</code>
				</div>
			</div>
		</div>

		<!-- Practice Section -->
		<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 border-b-2 border-gray-200 pb-3 text-2xl font-bold text-gray-900">
				🎯 Try It Yourself!
			</h2>
			<p class="mb-4 leading-relaxed text-gray-700">
				The best way to learn Markdown is to practice. Here are some places where you can try it
				right now:
			</p>
			<ul class="space-y-2 text-gray-700">
				<li class="flex items-start">
					<span class="mr-2 text-green-500">✓</span>
					<span><strong>StackEdit</strong> - Free online Markdown editor (stackedit.io)</span>
				</li>
				<li class="flex items-start">
					<span class="mr-2 text-green-500">✓</span>
					<span><strong>Dillinger</strong> - Another great online editor (dillinger.io)</span>
				</li>
				<li class="flex items-start">
					<span class="mr-2 text-green-500">✓</span>
					<span
						><strong>Discord/Reddit/GitHub</strong> - They all support Markdown in messages!</span
					>
				</li>
			</ul>
		</div>

		<!-- Footer -->
		<div class="rounded-2xl bg-white p-8 text-center shadow-lg">
			<p class="mb-4 text-gray-700">
				<strong>Want to learn more?</strong>
			</p>
			<a
				href="https://www.markdownguide.org/cheat-sheet/"
				target="_blank"
				class="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
			>
				Full Markdown Cheat Sheet →
			</a>
			<p class="mt-6 text-sm text-gray-500">Made with ❤️ for beginners</p>
		</div>
	</div>
</div>
