<template>
	<menus-button ico="file-json" :text="t('print.import')" huge @menu-click="importJSON" />
</template>

<script setup>
const editor = inject("editor");

const importJSON = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json,.html";
	input.multiple = false;
	input.onchange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.readAsText(file, "utf-8");
		reader.onload = () => {
			let dataSource = "";
			try {
				dataSource = JSON.parse(reader.result);
			} catch (err) {
				dataSource = reader.result;
				console.log("非JSON文件", reader.result);
			}
			editor.value?.chain().setContent(dataSource, true).focus().run();
		};
	};
	input.click();
};
</script>
