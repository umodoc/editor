import { DOMSerializer, Node, Schema } from "@tiptap/pm/model";
import { createHTMLDocument, VHTMLDocument } from "zeed-dom";
import Prism from 'prismjs'
import Katex from 'katex'

/**
 * 根据schema doc生成html
 * @param doc
 * @param schema
 * @param options
 */
export function getHTMLFromFragment(doc,schema, options) {
  if (options&&options.document) {
    const wrap = options.document.createElement('div')
    DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document: options.document }, wrap)
    return wrap.innerHTML
  }

  // Use zeed-dom for serialization.
  const zeedDocument = DOMSerializer.fromSchema(schema).serializeFragment(doc.content, {
    document: createHTMLDocument()
  })

  return zeedDocument.render()
}

/**
 * 计算最后一行是否填满
 * @param cnode
 */
export function getFlag(cnode, schema) {
  const paragraphDOM = document.getElementById(cnode.attrs.id)||iframeDoc.getElementById(cnode.attrs.id);
  if (!paragraphDOM) return null;
  const width = paragraphDOM.getBoundingClientRect().width;
  const html = generateHTML(getJsonFromDoc(cnode), schema);
  const { width: wordl } = computedWidth(html, false);
  //证明一行都没填满 应当执行 合并
  if (width >= wordl) {
    return false;
  }
  let strLength = 0;
  cnode.descendants((node, pos, _, _i) => {
    //todo 文字计算的时候使用性能较低 需要使用二分查找提高性能
    if (node.isText) {
      const nodeText = node.text;
      if (nodeText) {
        for (let i = 0; i < nodeText.length; i++) {
          const { width: wl } = computedWidth(nodeText.charAt(i));
          if (strLength + wl > width) {
            strLength = wl;
          } else {
            strLength += wl;
          }
        }
      }
    } else {
      const html = generateHTML(getJsonFromDoc(node), schema);
      const { width: wordl } = computedWidth(html);
      if (strLength + wordl > width) {
        strLength = wordl;
      } else {
        strLength += wordl;
      }
    }
  });
  const space = parseFloat(window.getComputedStyle(paragraphDOM).getPropertyValue("font-size"));
  return Math.abs(strLength - width) < space;
}


export function generateHTML(doc, schema) {
  const contentNode = Node.fromJSON(schema, doc)

  return getHTMLFromFragment(contentNode, schema)
}

function createAndCalculateHeight(node,content,splitContex){
  //生成需要计算的节点
  let calculateNode = node.type.create(node.attrs,content,node.marks);
  //生成对应的html
  const htmlNode = generateHTML(getJsonFromDoc(calculateNode), splitContex.schema);
  //计算高度
  let htmlNodeHeight = computedHeight(htmlNode,node.attrs.id);
  return htmlNodeHeight;
}

/**
 * 计算节点高度超出的位置
 */
function calculateNodeOverflowHeightAndPoint (node, dom,splitContex){
  //获得 dom现有高度
  const height = dom.offsetHeight;
  //拿到最后一个节点
  let lastChild = node.lastChild;
  //获取当前需要计算的节点有多少个
  let childCount = node.childCount;
  //最终计算的点有多少
  let point={};
  //获得到所有的节点 倒序遍历

  const content = node.content.content;
//倒序遍历content
  for (let i = childCount-1; i >=0; i--) {
    // @ts-ignore
    lastChild = content[i];
    //分割节点 永远保留最后一个节点用作计算
    let calculateContent =  i?content.slice(i):[];
    //节点如果是文本的处理方式
    if(lastChild.isText){
      let text =lastChild.text;
      // @ts-ignore
      let calculateLength=text.length-1;
      //计算每一个节点带来的影响
      while (calculateLength){
        let calculatetext =text.slice(0,calculateLength)
        //计算高度
        let htmlNodeHeight = createAndCalculateHeight(node,[...calculateContent,splitContex.schema.text(calculatetext)],splitContex);
        if(height>htmlNodeHeight){
          point={i,calculateLength}
          break;
        }
        calculateLength-=1;
      }
    }else {
      let htmlNodeHeight = createAndCalculateHeight(node,calculateContent,splitContex);
      if(height>htmlNodeHeight){
        point={i,calculateLength:0}
        break
      }
    }
  }
  let isFlag = true;
  let index = 0;
  node.descendants((node, pos, _, i) => {
    if (!isFlag) {
      return isFlag;
    }
    if(i==point.i){
      index = pos+point.calculateLength+1
      isFlag= false;
    }
  })
  return index

}


/**
 *获取段落里最后一个需要分页的地方
 * 行内中文字符和英文字符宽度超过 段落宽度 计算
 * 没有超过直接返回null
 * 由于行内有可能含有图片 不需要计算图片
 * @param cnode
 * @param dom
 */
export function getBreakPos(cnode, dom, splitContex) {
  const paragraphDOM = dom;
  if (!paragraphDOM) return null;
  const width = paragraphDOM.offsetWidth;
  const html = generateHTML(getJsonFromDoc(cnode), splitContex.schema);
  const { width: wordl } = computedWidth(html, false);
  //如果高度超过默认了 但是宽度没有超过 证明 只有一行 只是里面有 行内元素 比如 图片
  if (width >= wordl) {
    return null;
  }

  const index = calculateNodeOverflowHeightAndPoint(cnode,dom,splitContex);//calculateNodeOverflowWidthAndPoint(cnode, width, splitContex);
  return index ? index : null;
}

/**
 * 工具类
 * @param node
 */
export function getJsonFromDoc(node) {
  return {
    type: "doc",
    content: [node.toJSON()]
  };
}

export function getJsonFromDocForJson(json) {
  return {
    type: "doc",
    content: [json]
  };
}

let iframeComputed = null;
var iframeDoc = null;

/**
 * @description 获取节点高度 根据id获取dom高度
 * @author Cassie
 * @method getBlockHeight
 */
export function getBlockHeight(node) {
  const paragraphDOM = document.getElementById(node.attrs.id);
  if (paragraphDOM) {
    return paragraphDOM.offsetHeight;
  }
  return 0;
}

export class UnitConversion {
  arrDPI = [];

  constructor() {
    const arr = [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.screen.deviceXDPI) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      arr.push(window.screen.deviceXDPI);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      arr.push(window.screen.deviceYDPI);
    } else {
      const tmpNode = document.createElement("DIV");
      tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:-99;visibility:hidden";
      document.body.appendChild(tmpNode);
      arr.push(tmpNode.offsetWidth);
      arr.push(tmpNode.offsetHeight);
      if (tmpNode && tmpNode.parentNode) {
        tmpNode.parentNode.removeChild(tmpNode);
      }
    }
    this.arrDPI = arr;
  }

  /**
   * @description px to mm
   * @param value px值
   */
  pxConversionMm(value) {
    const inch = value / this.arrDPI[0];
    const c_value = inch * 25.4;
    return Number(c_value.toFixed());
  }

  /**
   * @description mm to px
   * @param value px值
   */
  mmConversionPx(value) {
    const inch = value / 25.4;
    const c_value = inch * this.arrDPI[0];
    return Number(c_value.toFixed());
  }

  cmConversionPx(value) {
    const inch = value*10 / 25.4;
    const c_value = inch * this.arrDPI[0];
    return Number(c_value.toFixed());
  }
}

const map = new Map();

export function computedHeight(html,id) {
  const computeddiv = iframeDoc.getElementById("computeddiv");
  if (computeddiv) {
    computeddiv.innerHTML = html;
    const htmldiv = iframeDoc.getElementById(id);
    const height = htmldiv.getBoundingClientRect().height;
    computeddiv.innerHTML = "&nbsp;";
    return height;
  }
  return 0;
}

export function computedWidth(html, cache = true) {
  if (map.has(html)) {
    return map.get(html);
  }
  const computedspan = iframeDoc.getElementById("computedspan");
  if (html == " ") {
    html = "&nbsp;";
  }
  if (computedspan) {
    computedspan.innerHTML = html;
    const width = computedspan.getBoundingClientRect().width;
    const height = computedspan.getBoundingClientRect().height;
    if (cache) {
      map.set(html, { height, width });
    }
    computedspan.innerHTML = "&nbsp;";
    return { height, width };
  }
  return 0;
}

export function getContentSpacing(dom) {
  const content = dom.querySelector(".content");
  if (dom && content) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const contentStyle = window.getComputedStyle(content);
    const paddingTop = contentStyle.getPropertyValue("padding-top");
    const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
    const marginTop = contentStyle.getPropertyValue("margin-top");
    const marginBottom = contentStyle.getPropertyValue("margin-bottom");
    const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
    const margin = parseFloat(marginTop) + parseFloat(marginBottom);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return padding + margin + (dom.offsetHeight - content.offsetHeight);
  }
  return 0;
}

export function getSpacing(dom) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const contentStyle = window.getComputedStyle(dom);
  const paddingTop = contentStyle.getPropertyValue("padding-top");
  const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
  const marginTop = contentStyle.getPropertyValue("margin-top");
  const marginBottom = contentStyle.getPropertyValue("margin-bottom");
  const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
  const margin = parseFloat(marginTop) + parseFloat(marginBottom);
  return padding + margin;
}

export function getDefault() {
  if (map.has("defaultheight")) {
    return map.get("defaultheight");
  }
  const computedspan = iframeDoc.getElementById("computedspan");
  const defaultheight = getDomHeight(computedspan);
  map.set("defaultheight", defaultheight);
  return defaultheight;
}

export function getDomPaddingAndMargin(dom) {
  const contentStyle = window.getComputedStyle(dom) || iframeComputed.contentWindow.getComputedStyle(dom);
  const paddingTop = contentStyle.getPropertyValue("padding-top");
  const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
  const marginTop = contentStyle.getPropertyValue("margin-top");
  const marginBottom = contentStyle.getPropertyValue("margin-bottom");
  const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
  const margin = parseFloat(marginTop) + parseFloat(marginBottom);
  return padding + margin + parseFloat(contentStyle.borderWidth);
}

export function getDomHeight(dom) {
  const contentStyle = window.getComputedStyle(dom) || iframeComputed.contentWindow.getComputedStyle(dom);
  const paddingTop = contentStyle.getPropertyValue("padding-top");
  const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
  const marginTop = contentStyle.getPropertyValue("margin-top");
  const marginBottom = contentStyle.getPropertyValue("margin-bottom");
  const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
  const margin = parseFloat(marginTop) + parseFloat(marginBottom);
  return padding + margin + dom.offsetHeight + parseFloat(contentStyle.borderWidth);
}

export function getAbsentHtmlH(node,schema) {
  const html = generateHTML(getJsonFromDoc(node),schema);
  const computeddiv = iframeDoc.getElementById("computeddiv");
  if (computeddiv) {
    computeddiv.innerHTML = html;
  }
  const nodesom = iframeDoc.getElementById(node.attrs.id);
  return nodesom;
}

export function removeAbsentHtmlH() {
  const computeddiv = iframeDoc.getElementById("computeddiv");
  computeddiv.innerHTML = "";
}

function iframeDocAddP() {
  const computedspan = iframeDoc.getElementById("computedspan");
  if (!computedspan) {
    const p = iframeDoc.createElement("p");
    p.setAttribute("id", "computedspan");
    p.setAttribute("style", "display: inline-block");
    p.innerHTML = "&nbsp;";
    iframeDoc.body.append(p);
  }
}

function iframeDocAddDiv() {
  const computeddiv = iframeDoc.getElementById("computeddiv");
  if (!computeddiv) {
    const {page,options} =useStore();
    const { width, height } = page.value.size
    const {right,left,bottom,top} =page.value.margin;
    const dom = iframeDoc.createElement("div");
    dom.setAttribute("class", "Page text-editor relative editor-container");
    dom.setAttribute("style", "opacity: 0;position: absolute;max-width:" + width + "cm;width:" + width + "cm;padding-left:"+left+"cm;padding-right:"+right+"cm;padding-top:"+top+"cm;padding-bottom:"+bottom+"cm;");
    const content = iframeDoc.createElement("div");
    content.classList.add("PageContent");
    content.setAttribute("id", "computeddiv");
    dom.append(content);
    iframeDoc.body.append(dom);
  }
}

export function removeComputedHtml() {
  const iframeComputed1 = document.getElementById("computediframe");
  if (iframeComputed1) {
    document.body.removeChild(iframeComputed1);
    iframeComputed = null;
    iframeDoc = null;
  }
}

/**
 * 构建计算html需要的辅助iframe 和打印html
 * @param options
 */
export function buildComputedHtml() {
  removeComputedHtml();
  iframeComputed = document.createElement("iframe");
  document.body.appendChild(iframeComputed);
  const { options} = useStore()
  const defaultLineHeight = () => {
    return options.value.dicts.lineHeights.find((item) => item.default).value
  }
  //获得文档对象
  iframeDoc = iframeComputed.contentDocument || iframeComputed.contentWindow.document;
  iframeComputed.setAttribute("id", "computediframe");
  iframeComputed.setAttribute("style", "width: 100%;height: 100%;");
  //iframeComputed.setAttribute("style", "width: 100%;height: 100%;opacity: 0;position: absolute;z-index: -89;margin-left:-2003px;");
  iframeDoc.body.setAttribute("class","editor-container")
  iframeDoc.body.setAttribute("style","line-height:"+defaultLineHeight())
  copyStylesToIframe(iframeDoc);
  iframeDocAddP();
  iframeDocAddDiv();
}
function copyStylesToIframe(iframeContentDoc) {
  // 获取当前页面的所有样式表
  const links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    if (links[i].rel === 'stylesheet') {
      const newLink = iframeContentDoc.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.href = links[i].href;
      iframeContentDoc.head.appendChild(newLink);
    }
  }
  const styles = document.querySelectorAll("style");
  styles.forEach(style => {
    // 创建一个新的<style>标签
    const newStyle = iframeContentDoc.createElement("style");
    // 将样式内容复制到新标签中
    newStyle.textContent = style.textContent;
    // 将新标签插入到iframe的<head>中
    iframeContentDoc.head.appendChild(newStyle);
  });
  const elementsWithInlineStyles = document.querySelectorAll("[style]");
  elementsWithInlineStyles.forEach(element => {
    const styleAttr = element.getAttribute("style");
    const clonedElement = iframeContentDoc.createElement(element.tagName);
    clonedElement.setAttribute("style", styleAttr);
    // 这里只是创建了带有内联样式的元素，根据实际情况，你可能需要将它们添加到iframe的DOM树中
  });
}
