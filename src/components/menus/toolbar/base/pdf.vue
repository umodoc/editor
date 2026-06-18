<!--
 * @Author: wangqz
 * @Date: 2026-06-18
 * @LastEditTime: 2026-06-18
 * @Description: content
-->
<template>
	<menus-button ico="file-pdf" :text="t('print.previewPdf')" huge @menu-click="previewPDF" />
</template>

<script setup>
import { h } from "vue";
import PDFObject from "pdfobject";
const editor = inject("editor");
const container = inject("container");
const page = inject("page");
const options = inject("options");
const getStylesHtml = () => {
	return Array.from(document.querySelectorAll("link, style"))
		.map((item) => item.outerHTML)
		.join("");
};

const getPlyrSprite = () => {
	return document.querySelector("#sprite-plyr")?.innerHTML || "";
};

const getContentHtml = () => {
	const originalContent = document.querySelector(`${container} .umo-page-content`)?.outerHTML || "";
	return prepareEchartsForPrint(originalContent);
};
// 因echart依赖于组件动态展示，打印时效果无法通过html实现，所以通过转成图片方式解决
const prepareEchartsForPrint = (htmlContent) => {
	// 创建一个临时DOM容器用于处理HTML内容
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = htmlContent;

	// 找到所有需要转换的ECharts实例
	const charts = tempDiv.querySelectorAll(".umo-node-echarts-body");
	for (const chartElement of charts) {
		const chartInstance = echarts.getInstanceByDom(chartElement);
		if (chartInstance) {
			// 使用getDataURL方法获取图表的base64图片数据
			const imgData = chartInstance.getDataURL({
				type: "png", // 可以是'png'或'jpeg'
				pixelRatio: 2, // 提高分辨率，默认是1//分辨率太高会慢
				backgroundColor: "#fff", // 背景颜色，默认是透明
			});

			// 创建一个新的img元素并设置其src属性为图表的base64图片数据
			const imgElement = document.createElement("img");
			imgElement.src = imgData;
			imgElement.style.width = "100%"; // 确保图片宽度适合容器，根据实际情况调整

			// 替换原图表元素为img元素
			if (chartElement && chartElement.parentNode) {
				chartElement.parentNode.replaceChild(imgElement, chartElement);
			}
		}
	}
	return tempDiv.innerHTML;
};

const defaultLineHeight = $computed(() => options.value.dicts?.lineHeights.find((item) => item.default)?.value);

const getIframeCode = () => {
	const { orientation, size, margin, background } = page.value;
	/* eslint-disable */
	return `
    <!DOCTYPE html>
    <html lang="zh-CN" theme-mode="${options.value.theme}">
    <head>
      <title>${options.value.document?.title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${getStylesHtml()}
      <style>
      html{
        margin: 0;
        padding: 0;
        overflow: visible;
      }
      body{
        margin: 0;
        padding: 0;
        background-color: ${background};
        -webkit-print-color-adjust: exact;
      }
      .umo-editor-container{
        background-color: ${background} !important;
      }
      .umo-page-content{
        transform: scale(1) !important;
        overflow: hidden;
      }
      @page {
        size: ${orientation === "portrait" ? size?.width : size?.height}cm ${orientation === "portrait" ? size?.height : size?.width}cm;
        padding: ${margin?.top}cm 0 ${margin?.bottom}cm;
        margin: 0;
        background-color: ${background};
      }
      @page:first {
        padding-top: 0;
      }
      @page:last {
        padding-bottom: 0;
        page-break-after: avoid;
      }
      </style>
    </head>
    <body class="is-print">
      <div id="sprite-plyr" style="display: none;">
      ${getPlyrSprite()}
      </div>
      <div class="umo-editor-container" style="line-height: ${defaultLineHeight};" aria-expanded="false">
        <div class="tiptap umo-editor" translate="no">
          ${getContentHtml()}
        </div>
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", (event) => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.removedNodes) {
                Array.from(mutation.removedNodes).forEach(node => {
                  if (node?.classList?.contains('umo-page-watermark')) {
                    location.reload();
                  }
                });
              }
            });
          });
        });
      <\/script>
    </body>
    </html>`;
	/* eslint-enable */
};

const generatePdf = async (htmlContent, options = {}) => {
	try {
		const response = await fetch("/html2pdf", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				html: htmlContent,
				format: options.format || "A4",
				printBackground: options.printBackground !== undefined ? options.printBackground : true,
				margin: options.margin || { top: "20px", bottom: "20px", left: "20px", right: "20px" },
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`PDF generation failed: ${response.status} ${errorText}`);
		}
		return response.blob();
	} catch (error) {
		console.error("Error generating PDF:", error);
		alert("生成PDF失败，请查看控制台错误信息");
		throw error;
	}
};

// 生成html => dompdf.js => pdfobject 预览
const previewPDF = async () => {
	useMessage("loading", {
		attach: container,
		content: t("print.previewPdf"),
		closeBtn: true,
	});
	editor.value?.commands.blur();
	const iframeCode = getIframeCode();
	const blob = await generatePdf(iframeCode);
	const pdfurl = URL.createObjectURL(blob);
	const uniqueId = `pre-pdf-${Date.now()}`;
	useAlert({
		attach: container,
		theme: "info",
		width: "800px",
		footer: false,
		header: t("print.previewPdf"),
		body: () => {
			return h("div", { id: uniqueId, style: "width:100%;height:800px;" }, "");
		},
		onOpened() {
			MessagePlugin.closeAll();
			PDFObject.embed(pdfurl, `#${uniqueId}`, {});
		},
		onClosed() {
			URL.revokeObjectURL(pdfurl);
		},
	});
};
</script>
