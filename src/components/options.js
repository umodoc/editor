import { ObjectSchema } from '@humanwhocodes/object-schema'

// 默认配置
const defaultOptions = {
  editorKey: 'default',
  height: '100%',
  dicts: {
    fonts: [
      { label: '默认字体', value: null },
      { label: '宋体', value: 'SimSun' },
      { label: '黑体', value: 'SimHei' },
      { label: '楷体', value: 'KaiTi' },
      { label: '楷体_GB2312', value: 'KaiTi_GB2312' },
      { label: '仿宋', value: 'FangSong' },
      { label: '仿宋_GB2312', value: 'FangSong_GB2312' },
      { label: '华文宋体', value: 'STSong' },
      { label: '华文仿宋', value: 'STFangsong' },
      { label: '方正仿宋简体', value: 'FZFangSong-Z02S' },
      { label: '方正小标宋', value: 'FZXiaoBiaoSong-B05S' },
      { label: '微软雅黑', value: 'Microsoft Yahei' },
      { label: 'Arial', value: 'Arial' },
      { label: 'Times New Roman', value: 'Times New Roman' },
      { label: 'Verdana', value: 'Verdana' },
      { label: 'Helvetica', value: 'Helvetica' },
      { label: 'Calibri', value: 'Calibri' },
      { label: 'Cambria', value: 'Cambria' },
      { label: 'Tahoma', value: 'Tahoma' },
      { label: 'Georgia', value: 'Georgia' },
      { label: 'Comic Sans MS', value: 'Comic Sans MS' },
      { label: 'Impact', value: 'Impact' },
    ],
    // prettier-ignore
    colors: [
    '#FFF','#000','#4A5366','#3B74EC','#45A2EF','#529867','#CD4A3F','#EA8D40','#EEC543', '#8E45D0','#F2F2F2','#7F7F7F','#F4F5F7','#CBDCFC','#E8F6FE','#EDFAF2','#FCEAE9','#FDF3EC','#FEF9E5','#FAECFE','#EEE','#595959','#C6CAD2','#CEEBFD','#CBDCFC','#CBE9D7','#F7CBC9','#FADDC7','#FDEEB5','#EBCAFC', '#BFBFBF','#3F3F3F','#828B9D','#A0BEFA','#A7DCFC','#A6D5B8','#F2A19C','#F5BC8C','#FBE281','#CB94F9','#A5A5A5','#262626','#363B44','#2452B2','#3473A1','#417A53','#922B22','#AD642A','#9E8329','#57297D','#939393','#0D0D0D','#25272E','#15316A','#1C415A','#284D34','#511712','#573213','#635217','#36194E',
  ],
    lineHeights: [
      { label: '单倍行距', value: 1 },
      { label: '1.5 倍行距', value: 1.5, default: true },
      { label: '2 倍行距', value: 2 },
      { label: '2.5 倍行距', value: 2.5 },
      { label: '3 倍行距', value: 3 },
    ],
    specialCharacters: [
      { label: '普通文本', items: '‹›«»‘’“”‚„¡¿‥…‡‰‱‼⁈⁉⁇©®™§¶⁋' },
      { label: '货币符号', items: '$€¥£¢₠₡₢₣₤¤₿₥₦₧₨₩₪₫₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽' },
      {
        label: '数学符号',
        items: '<>≤≥–—¯‾°−±÷⁄×ƒ∫∑∞√∼≅≈≠≡∈∉∋∏∧∨¬∩∪∂∀∃∅∇∗∝∠¼½¾',
      },
      { label: '箭头', items: '←→↑↓⇐⇒⇑⇓⇠⇢⇡⇣⇤⇥⤒⤓↨' },
      {
        label: '拉丁语',
        items:
          'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ',
      },
    ],
    emojis: [
      {
        label: '表情与角色',
        items:
          '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 🫠 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺️ 😚 😙 🥲 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🫢 🫣 🤫 🤔 🫡 🤐 🤨 😐 😑 😶 🫥 😶‍🌫️ 😏 😒 🙄 😬 😮‍💨 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 😵‍💫 🤯 🤠 🥳 🥸 😎 🤓 🧐 😕 🫤 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 🥹 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 👿 💀 ☠️ 💩 🤡 👹 👺 👻 👽 👾 🤖 👋 🤚 🖐️ ✋ 🖖 🫱 🫲 🫳 🫴 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 🫵 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 🫶 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻',
      },
      {
        label: '动物与自然',
        items:
          '🐵 🐒 🦍 🦧 🐶 🐕 🦮 🐕‍🦺 🐩 🐺 🦊 🦝 🐱 🐈 🐈‍⬛ 🦁 🐯 🐅 🐆 🐴 🐎 🦄 🦓 🦌 🦬 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦙 🦒 🐘 🦣 🦏 🦛 🐭 🐁 🐀 🐹 🐰 🐇 🐿️ 🦫 🦔 🦇 🐻 🐻‍❄️ 🐨 🐼 🦥 🦦 🦨 🦘 🦡 🐾 🦃 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🕊️ 🦅 🦆 🦢 🦉 🦤 🪶 🦩 🦚 🦜 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🦭 🐟 🐠 🐡 🦈 🐙 🐚 🪸 🐌 🦋 🐛 🐜 🐝 🪲 🐞 🦗 🪳 🕷️ 🕸️ 🦂 🦟 🪰 🪱 🦠 💐 🌸 💮 🪷 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🪴 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃 🪹 🪺',
      },
      {
        label: '食物与食品',
        items:
          '🥬 🥦 🧄 🧅 🍄 🥜 🫘 🌰 🍞 🥐 🥖 🫓 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🫔 🥙 🧆 🥚 🍳 🥘 🍲 🫕 🥣 🥗 🍿 🧈 🧂 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🥮 🍡 🥟 🥠 🥡 🦀 🦞 🦐 🦑 🦪 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🫖 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🫗 🥤 🧋 🧃 🧉 🧊 🥢 🍽️ 🍴 🥄 🔪 🫙 🏺',
      },
      {
        label: '活动',
        items:
          '🎗️ 🎟️ 🎫 🎖️ 🏆 🏅 🥇 🥈 🥉 ⚽ ⚾ 🥎 🏀 🏐 🏈 🏉 🎾 🥏 🎳 🏏 🏑 🏒 🥍 🏓 🏸 🥊 🥋 🥅 ⛳ ⛸️ 🎣 🤿 🎽 🎿 🛷 🥌 🎯 🪀 🪁 🎱 🔮 🪄 🧿 🪬 🎮 🕹️ 🎰 🎲 🧩 🧸 🪅 🪩 🪆 ♠️ ♥️ ♦️ ♣️ ♟️ 🃏 🀄 🎴 🎭 🖼️ 🎨 🧵 🪡 🧶 🪢',
      },
      {
        label: '旅行与景点',
        items:
          '🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🛻 🚚 🚛 🚜 🏎️ 🏍️ 🛵 🦽 🦼 🛺 🚲 🛴 🛹 🛼 🚏 🛣️ 🛤️ 🛢️ ⛽ 🛞 🚨 🚥 🚦 🛑 🚧 ⚓ 🛟 ⛵ 🛶 🚤 🛳️ ⛴️ 🛥️ 🚢 ✈️ 🛩️ 🛫 🛬 🪂 💺 🚁 🚟 🚠 🚡 🛰️ 🚀 🛸 🛎️ 🧳 ⌛ ⏳ ⌚ ⏰ ⏱️ ⏲️ 🕰️ 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 🌡️ ☀️ 🌝 🌞 🪐 ⭐ 🌟 🌠 🌌 ☁️ ⛅ ⛈️ 🌤️ 🌥️ 🌦️ 🌧️ 🌨️ 🌩️ 🌪️ 🌫️ 🌬️ 🌀 🌈 🌂 ☂️ ☔ ⛱️ ⚡ ❄️ ☃️ ⛄ ☄️ 🔥 💧 🌊',
      },
      {
        label: '物品',
        items:
          '📃 📜 📄 📰 🗞️ 📑 🔖 🏷️ 💰 🪙 💴 💵 💶 💷 💸 💳 🧾 💹 ✉️ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 🗳️ ✏️ ✒️ 🖋️ 🖊️ 🖌️ 🖍️ 📝 💼 📁 📂 🗂️ 📅 📆 🗒️ 🗓️ 📇 📈 📉 📊 📋 📌 📍 📎 🖇️ 📏 📐 ✂️ 🗃️ 🗄️ 🗑️ 🔒 🔓 🔏 🔐 🔑 🗝️ 🔨 🪓 ⛏️ ⚒️ 🛠️ 🗡️ ⚔️ 🔫 🪃 🏹 🛡️ 🪚 🔧 🪛 🔩 ⚙️ 🗜️ ⚖️ 🦯 🔗 ⛓️ 🪝 🧰 🧲 🪜 ⚗️ 🧪 🧫 🧬 🔬 🔭 📡 💉 🩸 💊 🩹 🩼 🩺 🩻 🚪 🛗 🪞 🪟 🛏️ 🛋️ 🪑 🚽 🪠 🚿 🛁 🪤 🪒 🧴 🧷 🧹 🧺 🧻 🪣 🧼 🫧 🪥 🧽 🧯 🛒 🚬 ⚰️ 🪦 ⚱️ 🗿 🪧 🪪',
      },
      {
        label: '符号',
        items:
          '➰ ➿ 〽️ ✳️ ✴️ ❇️ ©️ ®️ ™️ #️⃣ *️⃣ 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔠 🔡 🔢 🔣 🔤 🅰️ 🆎 🅱️ 🆑 🆒 🆓 ℹ️ 🆔 Ⓜ️ 🆕 🆖 🅾️ 🆗 🅿️ 🆘 🆙 🆚 🈁 🈂️ 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜ ◼️ ◻️ ◾ ◽ ▪️ ▫️ 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲',
      },
      {
        label: '旗帜',
        items:
          '🏁 🇨🇳 🎌 🇩🇪 🇪🇸 🇦🇨 🇦🇩 🇦🇪 🇦🇫 🇦🇬 🇦🇮 🇦🇱 🇦🇲 🇦🇴 🇦🇶 🇦🇷 🇦🇸 🇦🇹 🇦🇺 🇦🇼 🇦🇽 🇦🇿 🇧🇦 🇧🇧 🇧🇩 🇧🇪 🇧🇫 🇧🇬 🇧🇭 🇧🇮 🇧🇯 🇧🇱 🇧🇲 🇧🇳 🇧🇴 🇧🇶 🇧🇷 🇧🇸 🇧🇹 🇧🇻 🇧🇼 🇧🇾 🇧🇿 🇨🇦 🇨🇨 🇨🇩 🇨🇫 🇨🇬 🇨🇭 🇨🇮 🇨🇰 🇨🇱 🇨🇲 🇨🇴 🇨🇵 🇨🇷 🇨🇺 🇨🇻 🇨🇼 🇨🇽 🇨🇾 🇨🇿 🇩🇬 🇩🇯 🇩🇰 🇩🇲 🇩🇴 🇩🇿 🇪🇦 🇪🇨 🇪🇪 🇪🇬 🇪🇭 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇪🇷 🇪🇹 🇪🇺 🇫🇮 🇫🇯 🇫🇰 🇫🇲 🇫🇴 🇬🇦 🇬🇩 🇬🇪 🇬🇫 🇬🇬 🇬🇭 🇬🇮 🇬🇱 🇬🇲 🇬🇳 🇬🇵 🇬🇶 🇬🇷 🇬🇸 🇬🇹 🇬🇺 🇬🇼 🇬🇾 🇭🇰 🇭🇲 🇭🇳 🇭🇷 🇭🇹 🇭🇺 🇮🇨 🇮🇩 🇮🇪 🇮🇱 🇮🇲 🇮🇳 🇮🇴 🇮🇶 🇮🇷 🇮🇸 🇯🇪 🇯🇲 🇯🇴 🇰🇪 🇰🇬 🇰🇭 🇰🇮 🇰🇲 🇰🇳 🇰🇵 🇰🇼 🇰🇾 🇰🇿 🇱🇦 🇱🇧 🇱🇨 🇱🇮 🇱🇰 🇱🇷 🇱🇸 🇱🇹 🇱🇺 🇱🇻 🇱🇾 🇲🇦 🇲🇨 🇲🇩 🇲🇪 🇲🇫 🇲🇬 🇲🇭 🇲🇰 🇲🇱 🇲🇲 🇲🇳 🇲🇴 🇲🇵 🇲🇶 🇲🇷 🇲🇸 🇲🇹 🇲🇺 🇲🇻 🇲🇼 🇲🇽 🇲🇾 🇲🇿 🇳🇦 🇳🇨 🇳🇪 🇳🇫 🇳🇬 🇳🇮 🇳🇱 🇳🇴',
      },
    ],
    pageSizes: [
      { label: 'A4', width: 21.0, height: 29.4, default: true },
      { label: 'A3', width: 29.7, height: 42.0 },
      { label: 'A5', width: 14.8, height: 21.0 },
      { label: 'B5', width: 17.6, height: 25.0 },
      { label: '5号信封', width: 10.9, height: 12.9 },
      { label: '6号信封', width: 11.9, height: 22.9 },
      { label: '7号信封', width: 16.1, height: 22.8 },
      { label: '9号信封', width: 22.8, height: 32.3 },
      { label: '法律用纸', width: 21.5, height: 33.5 },
      { label: '信纸', width: 21.5, height: 27.9 },
    ],
  },
  toolbar: {
    defaultMode: 'ribbon',
    enableSourceEditor: false,
    menus: ['base', 'insert', 'table', 'tools', 'page', 'export'],
    disableMenuItems: [],
  },
  page: {
    defaultMargin: {
      left: 3.18,
      right: 3.18,
      top: 2.54,
      bottom: 2.54,
    },
    defaultOrientation: 'horizontal',
    defaultBackground: '#fff',
    showBreakMarks: true,
    watermark: {
      type: 'compact',
      alpha: 0.2,
      fontColor: '#000',
      fontSize: 16,
      fontFamily: 'SimSun',
      fontWeight: 'normal',
      text: '',
    },
  },
  document: {
    title: '未命名文档',
    content: '',
    placeholder: '请输入文档内容...',
    enableSpellcheck: true,
    enableMarkdown: true,
    enableBubbleMenu: true,
    readOnly: false,
    autofocus: true,
    characterLimit: 0,
    typographyRules: {},
  },
  templates: [],
  cdnUrl: 'https://unpkg.com/@umoteam/editor-external@latest',
  shareUrl: location?.href || '',
  diagrams: {
    domain: 'https://embed.diagrams.net',
    // https://www.drawio.com/doc/faq/supported-url-parameters
    params: {},
  },
  file: {
    allowedMimeTypes: [],
    maxSize: 1024 * 1024 * 100, // 100M
  },
  async onSave(content, page, document) {
    throw new Error('Key "onSave": Please set the save method')
  },
  async onFileUpload(file) {
    if (!file) throw new Error('File not found')
    throw new Error('Key "onFileUpload": Please set the upload method')
  },
  onFileDelete(id, src) {
    console.error(
      'The file has been deleted. Please configure the onFileDelete to completely delete the file from the server.',
    )
  },
}

// 组件 props 所需格式
const propsOptions = Object.keys(defaultOptions)

const isNumber = (char) => {
  if (typeof char === 'number') {
    return isFinite(char)
  }
  if (typeof char === 'string') {
    const parsed = parseFloat(char)
    return !isNaN(parsed) && isFinite(parsed) && char === parsed.toString()
  }
  return false
}

const ojbectSchema = new ObjectSchema({
  editorKey: {
    merge: 'replace',
    validate: 'string!',
  },
  height: {
    merge: 'replace',
    validate: 'string!',
  },
  dicts: {
    schema: {
      fonts: {
        merge: 'replace',
        validate(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "fonts": must be a array.')
          }
          value.forEach((item) => {
            if (!item.label || (!item.value && item.value !== null)) {
              throw new Error(
                'Key "dicts": Key "fonts": must be a array of objects with "label" and "value" properties.',
              )
            }
          })
        },
      },
      colors: {
        merge: 'replace',
        validate: 'array',
      },
      lineHeights: {
        merge: 'replace',
        validate(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "lineHeights": must be a array.')
          }
          if (!value.find((item) => item.default)) {
            throw new Error(
              'Key "dicts": Key "lineHeights": please set a default value.',
            )
          }
          value.forEach((item) => {
            if (!item.label || (!item.value && item.value !== null)) {
              throw new Error(
                'Key "dicts": Key "lineHeights": must be a array of objects with "label" and "value" properties.',
              )
            }
          })
        },
      },
      specialCharacters: {
        merge: 'replace',
        validate: 'array',
      },
      emojis: {
        merge: 'replace',
        validate: 'array',
      },
      pageSizes: {
        merge: 'replace',
        validate(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "pageSizes": must be a array.')
          }
          if (!value.find((item) => item.default)) {
            throw new Error(
              'Key "dicts": Key "pageSizes": please set a default value.',
            )
          }
          value.forEach((item, index) => {
            if (!item.label || item.label === '') {
              throw new Error(
                `Key "dicts": Key "pageSizes[${index}]" Key: "label" cannot be empty.`,
              )
            }
            if (!isNumber(item.width)) {
              throw new Error(
                `Key "dicts": Key "pageSizes[${index}]" Key: "width" must be a number.`,
              )
            }
            if (!isNumber(item.height)) {
              throw new Error(
                `Key "dicts": Key "pageSizes[${index}]" Key: "height" must be a number.`,
              )
            }
          })
        },
      },
    },
  },
  toolbar: {
    schema: {
      defaultMode: {
        merge: 'replace',
        validate(value) {
          if (value && !['classic', 'ribbon'].includes(value)) {
            throw new Error(
              'Key "toolbar": Key "defaultMode" must be one of "classic" or "ribbon".',
            )
          }
        },
      },
      enableSourceEditor: {
        merge: 'replace',
        validate: 'boolean',
      },
      menus: {
        merge: 'replace',
        validate(value) {
          const defaultMenus = defaultOptions.toolbar.menus
          if (value && !Array.isArray(value)) {
            throw new Error('Key "toolbar": Key "menus" must be a array.')
          }
          if (!value.includes('base')) {
            throw new Error(
              'Key "toolbar": Key "menus" should at least contain "base".',
            )
          }
          if (!value.every((item) => defaultMenus.includes(item))) {
            throw new Error(
              `Key "toolbar": Key "menus" the array items of toolbar.menus must contain only one or multiple of ${JSON.stringify(defaultMenus)}.`,
            )
          }
        },
      },
      disableMenuItems: {
        merge: 'replace',
        validate(value) {
          if (value && !Array.isArray(value)) {
            throw new Error(
              'Key "toolbar": Key "disableMenuItems" must be a array.',
            )
          }
        },
      },
    },
  },
  page: {
    schema: {
      defaultMargin: {
        schema: {
          left: {
            merge: 'replace',
            validate: 'number',
          },
          right: {
            merge: 'replace',
            validate: 'number',
          },
          top: {
            merge: 'replace',
            validate: 'number',
          },
          bottom: {
            merge: 'replace',
            validate: 'number',
          },
        },
      },
      defaultOrientation: {
        merge: 'replace',
        validate(value) {
          if (value && !['horizontal', 'vertical'].includes(value)) {
            throw new Error(
              'Key "page": Key "defaultOrientation": defaultOrientation" must be one of "horizontal" or "vertical".',
            )
          }
        },
      },
      defaultBackground: {
        merge: 'replace',
        validate: 'string',
      },
      showBreakMarks: {
        merge: 'replace',
        validate: 'boolean',
      },
      watermark: {
        schema: {
          type: {
            merge: 'replace',
            validate(value) {
              if (value && !['compact', 'spacious'].includes(value)) {
                throw new Error(
                  'Key "watermark": Key "type" must be one of "compact" or "spacious".',
                )
              }
            },
          },
          alpha: {
            merge: 'replace',
            validate: 'number',
          },
          fontColor: {
            merge: 'replace',
            validate: 'string',
          },
          fontFamily: {
            merge: 'replace',
            validate(value) {
              if (value !== null && typeof value !== 'string') {
                throw new Error(
                  'Key "watermark": Key "fontFamily" must be a string.',
                )
              }
            },
          },
          fontSize: {
            merge: 'replace',
            validate: 'number',
          },
          fontWeight: {
            merge: 'replace',
            validate: 'string',
          },
          text: {
            merge: 'replace',
            validate: 'string',
          },
        },
      },
    },
  },
  document: {
    schema: {
      title: {
        merge: 'replace',
        validate: 'string',
      },
      content: {
        merge: 'replace',
        validate() {},
      },
      placeholder: {
        merge: 'replace',
        validate: 'string',
      },
      enableSpellcheck: {
        merge: 'replace',
        validate: 'boolean',
      },
      enableMarkdown: {
        merge: 'replace',
        validate: 'boolean',
      },
      enableBubbleMenu: {
        merge: 'replace',
        validate: 'boolean',
      },
      readOnly: {
        merge: 'replace',
        validate: 'boolean',
      },
      autofocus: {
        merge: 'replace',
        validate: 'boolean',
      },
      characterLimit: {
        merge: 'replace',
        validate: 'number',
      },
      typographyRules: {
        merge: 'replace',
        validate: 'object',
      },
    },
  },
  shareUrl: { merge: 'replace', validate: 'string' },
  templates: {
    merge: 'replace',
    validate(value) {
      if (value && !Array.isArray(value)) {
        throw new Error('Key "templates": Key "menus" must be a array.')
      }
      value.forEach((item, index) => {
        if (!item.title || !item.title === '') {
          throw new Error(
            `Key "templates[${index}]": Key "title" cannot be empty.`,
          )
        }
        if (!item.content || !item.content === '') {
          throw new Error(
            `Key "templates[${index}]": Key "content" cannot be empty.`,
          )
        }
      })
    },
  },
  cdnUrl: {
    merge: 'replace',
    validate: 'string',
  },
  diagrams: {
    merge: 'assign',
    validate: 'object',
  },
  file: {
    schema: {
      allowedMimeTypes: {
        merge: 'replace',
        validate: 'array',
      },
      maxSize: {
        merge: 'replace',
        validate: 'number',
      },
      onUpload: {
        merge: 'replace',
        validate(value) {
          if (value.constructor.name !== 'AsyncFunction') {
            throw new Error(
              'Key "upload": Key "onUpload" must be a async function.',
            )
          }
        },
      },
      onDelete: {
        merge: 'replace',
        validate(value) {
          if (
            typeof value !== 'function' &&
            value.constructor.name !== 'AsyncFunction'
          ) {
            throw new Error('Key "upload": Key "onDelete" must be a function.')
          }
        },
      },
    },
  },
  onSave: {
    merge: 'replace',
    validate(value) {
      if (
        value.constructor.name !== 'AsyncFunction' &&
        value instanceof Promise
      ) {
        throw new Error(
          'Key "document": Key "saveNethod" must be a async function.',
        )
      }
    },
  },
  onFileUpload: {
    merge: 'replace',
    validate(value) {
      if (value.constructor.name !== 'AsyncFunction') {
        throw new Error(
          'Key "upload": Key "onUpload" must be a async function.',
        )
      }
    },
  },
  onFileDelete: {
    merge: 'replace',
    validate(value) {
      if (
        typeof value !== 'function' &&
        value.constructor.name !== 'AsyncFunction'
      ) {
        throw new Error('Key "upload": Key "onDelete" must be a function.')
      }
    },
  },
})

export { defaultOptions, propsOptions, ojbectSchema }
