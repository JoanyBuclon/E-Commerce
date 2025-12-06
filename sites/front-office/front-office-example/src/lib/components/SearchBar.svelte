<script lang="ts">
	interface SearchBarProps {
		value: string;
		onInput: (value: string) => void;
		placeholder?: string;
	}

	let { value, onInput, placeholder = 'Search for products...' }: SearchBarProps = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onInput(target.value);
	}
</script>

<form role="search" class="flex flex-1 max-w-2xl rounded-lg overflow-hidden" onsubmit={(e) => e.preventDefault()}>
	<input
		type="search"
		{value}
		oninput={handleInput}
		{placeholder}
		aria-label="Search products"
		class="px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
	/>
	<button
		type="submit"
		aria-label="Submit search"
		class="bg-orange-500 hover:bg-orange-600 px-6 py-2 text-white transition-colors duration-200"
	>
		🔍
	</button>
</form>
