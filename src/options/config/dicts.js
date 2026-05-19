const fonts = [
  { label: 'Default Font', value: null },
  {
    label: 'Noto Sans SC',
    value: 'Noto Sans SC',
    url: 'https://fonts.gstatic.com/s/notosanssc/v40/k3kXo84MPvpLmixcA63oeALhLIiP-Q-87KaAaH7rzeAODp22mF0qmF4CSjmPC6A0Rg5g1igg1w.4.woff2',
    format: 'woff2',
  },
  {
    label: 'Noto Serif SC',
    value: 'Noto Serif SC',
    url: 'https://fonts.gstatic.com/s/notoserifsc/v35/H4cyBXePl9DZ0Xe7gG9cyOj7uK2-n-D2rd4FY7SCqyWv.ttf',
    format: 'truetype',
  },
  { label: 'Songti', value: 'SimSun' },
  { label: 'Heiti', value: 'SimHei' },
  { label: 'Kaiti', value: 'KaiTi' },
  { label: 'Kaiti GB2312', value: 'KaiTi_GB2312' },
  { label: 'Fangsong', value: 'FangSong' },
  { label: 'Fangsong GB2312', value: 'FangSong_GB2312' },
  { label: 'STSong', value: 'STSong' },
  { label: 'STFangsong', value: 'STFangsong' },
  { label: 'FZ Fangsong Simplified', value: 'FZFangSong-Z02S' },
  { label: 'FZ Xiaobiao Song', value: 'FZXiaoBiaoSong-B05S' },
  { label: 'Microsoft Yahei', value: 'Microsoft Yahei' },
  { label: 'PingFang SC', value: 'PingFang SC' },
  { label: 'Hiragino Sans GB', value: 'Hiragino Sans GB' },
  { label: 'DengXian', value: 'DengXian' },
  { label: 'DengXian Light', value: 'DengXian Light' },
  { label: 'YouYuan', value: 'YouYuan' },
  { label: 'LiSu', value: 'LiSu' },
  { label: 'NSimSun', value: 'NSimSun' },
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
]

const colors = [
  '#FFF',
  '#000',
  '#4A5366',
  '#3B74EC',
  '#45A2EF',
  '#529867',
  '#CD4A3F',
  '#EA8D40',
  '#EEC543',
  '#8E45D0',
  '#F2F2F2',
  '#7F7F7F',
  '#F4F5F7',
  '#CBDCFC',
  '#E8F6FE',
  '#EDFAF2',
  '#FCEAE9',
  '#FDF3EC',
  '#FEF9E5',
  '#FAECFE',
  '#EEE',
  '#595959',
  '#C6CAD2',
  '#CEEBFD',
  '#CBDCFC',
  '#CBE9D7',
  '#F7CBC9',
  '#FADDC7',
  '#FDEEB5',
  '#EBCAFC',
  '#BFBFBF',
  '#3F3F3F',
  '#828B9D',
  '#A0BEFA',
  '#A7DCFC',
  '#A6D5B8',
  '#F2A19C',
  '#F5BC8C',
  '#FBE281',
  '#CB94F9',
  '#A5A5A5',
  '#262626',
  '#363B44',
  '#2452B2',
  '#3473A1',
  '#417A53',
  '#922B22',
  '#AD642A',
  '#9E8329',
  '#57297D',
  '#939393',
  '#0D0D0D',
  '#25272E',
  '#15316A',
  '#1C415A',
  '#284D34',
  '#511712',
  '#573213',
  '#635217',
  '#36194E',
]

const lineHeights = [
  { label: 'Single', value: 1 },
  { label: '1.5 Line Spacing', value: 1.5 },
  { label: '1.75 Line Spacing', value: 1.75, default: true },
  { label: 'Double', value: 2 },
  { label: '2.5 Line Spacing', value: 2.5 },
  { label: 'Triple', value: 3 },
]

const symbols = [
  {
    label: 'Plain Text',
    items: '‹›«»‘’“”‚„¡¿‥…‡‰‱‼⁈⁉⁇©®™§¶⁋',
  },
  {
    label: 'Currency Symbols',
    items: '$€¥£¢₠₡₢₣₤¤₿₥₦₧₨₩₪₫₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽',
  },
  {
    label: 'Mathematical Symbols',
    items: '<>≤≥–—¯‾°−±÷⁄×ƒ∫∑∞√∼≅≈≠≡∈∉∋∏∧∨¬∩∪∂∀∃∅∇∗∝∠¼½¾',
  },
  { label: 'Arrows', items: '←→↑↓⇐⇒⇑⇓⇠⇢⇡⇣⇤⇥⤒⤓↨' },
  {
    label: 'Latin Script',
    items:
      'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ',
  },
]

const emojis = [
  {
    label: 'Emotions & People',
    items:
      '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😙 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😶‍ 😏 😒 🙄 😬 😮‍ 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 😵‍💫 🤯 🤠 🥳 😎 🤓 🧐 😕 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 👿 💀 ☠️ 💩 🤡 👹 👺 👻 👽 👾 🤖 👋 🤚 🖐️ ✋ 🖖 👌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻',
  },
  {
    label: 'Animals & Nature',
    items:
      '🐵 🐒 🦍 🦧 🐶 🐕 🦮 🐕‍🦺 🐩 🐺 🦊 🦝 🐱 🐈 🐈‍⬛ 🦁 🐯 🐅 🐆 🐴 🐎 🦄 🦓 🦌 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦙 🦒 🐘 🦏 🦛 🐭 🐁 🐀 🐹 🐰 🐇 🐿️ 🦔 🦇 🐻 🐻‍❄️ 🐨 🐼 🦥 🦦 🦨 🦘 🦡 🐾 🦃 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🕊️ 🦅 🦆 🦢 🦉 🦩 🦚 🦜 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🦭 🐟 🐠 🐡 🦈 🐙 🐚 🐌 🦋 🐛 🐜 🐝 🐞 🦗 🕷️ 🕸️ 🦂 🦟 🦠 💐 🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 ☀️ 🌝 🌞 🪐 🌟 🌠 🌌 ☁️ ⛅ ⛈️ 🌤️ 🌥️ 🌦️ 🌧️ 🌨️ 🌩️ 🌪️ 🌫️ 🌬️ 🌀 🌈 🌂 ☂️ ☔ ⛱️ ⚡ ❄️ ☃️ ⛄ ☄️ 🔥 💧 🌊',
  },
  {
    label: 'Food & Drink',
    items:
      '🍇 🍉 🍊 🍋 🍌 🍍 🥭 🍎 🍏 🍐 🍑 🍒 🍓 🥝 🍅 🥥 🥑 🍆 🥔 🥕 🌽 🌶️ 🥬 🥦 🧄 🧅 🍄 🥜 🌰 🍞 🥐 🥖 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🧆 🥚 🍳 🥘 🍲 🥣 🥗 🍿 🧈 🧂 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🥮 🍡 🥟 🥠 🥡 🦀 🦞 🦐 🦑 🦪 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🥤 🧃 🧉 🧊 🥢 🍽️ 🍴 🥄 🔪 🏺',
  },
  {
    label: 'Activities',
    items:
      '🧧 🎁 🎄 🧨 ✨ 🎈 🎉 🏮 🎗️ 🎟️ 🎫 🎖️ 🏆 🏅 🥇 🥈 🥉 ⚽ ⚾ 🥎 🏀 🏐 🏈 🏉 🎾 🥏 🎳 🏏 🏑 🏒 🥍 🏓 🏸 🥊 🥋 🥅 ⛳ ⛸️ 🎣 🤿 🎽 🎿 🛷 🥌 🎯 🪀 🪁 🎱 🔮 🧿 🎮 🕹️ 🎰 🎲 🧩 🧸 ♟️ 🃏 🀄 🎴 🎭 🖼️ 🎨 🧵 🧶',
  },
  {
    label: 'Travel & Places',
    items:
      '🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🚚 🚛 🚜 🏎️ 🏍️ 🛵 🦽 🦼 🛺 🚲 🛴 🛹 🚏 🛣️ 🛤️ 🛢️ ⛽ 🚨 🚥 🚦 🛑 🚧 ⚓ ⛵ 🛶 🚤 🛳️ ⛴️ 🛥️ 🚢 ✈️ 🛩️ 🛫 🛬 🪂 💺 🚁 🚟 🚠 🚡 🛰️ 🚀 🛸 🛎️ 🧳 🧭 ⌚ ⏰ ⏱️ ⏲️ 🕰️ 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦',
  },
  {
    label: 'Objects',
    items:
      '📔 📕 📖 📗 📘 📙 📚 📒 📃 📜 📄 📰 🗞️ 📑 🔖 🏷️ 💰 🔍 🔎 💴 💵 💶 💷 💸 💳 🧾 💹 ✉️ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 🗳️ ✏️ ✒️ 🖋️ 🖊️ 🖌️ 🖍️ 📝 💼 📁 📂 🗂️ 📅 📆 🗒️ 🗓️ 📇 📈 📉 📊 📋 📌 📍 📎 🖇️ 📏 📐 ✂️ 🗃️ 🗄️ 🗑️ 🔒 🔓 🔏 🔐 🔑 🗝️ 🔨 🪓 ⛏️ ⚒️ 🛠️ 🗡️ ⚔️ 🔫 🏹 🛡️ 🔧 🔩 ⚙️ 🗜️ ⚖️ 🦯 🔗 ⛓️ 🧰 🧲 ⚗️ 🧪 🧫 🧬 🔬 🔭 📡 💉 🩸 💊 🩹 🩺 🚪 🛏️ 🛋️ 🪑 🚽 🚿 🛁 🪒 🧴 🧷 🧹 🧺 🧻 🧼 🧽 🧯 🛒 🚬 ⚰️ ⚱️ 💎 🔇 🔈 🔉 🔊 🔔 🔕 🔋 🔌 💻 🖥️ 🖨️ ⌨️ 🖱️ 🖲️ 📷 🧱',
  },
  {
    label: 'Symbols',
    items:
      '💡 ✅ ☑️ ✔️ ❌ ❎ ❓ ❗ ❔ ❕ ⌛ ⏳ 💰 🆒 🆕 🆖 🅾️ 🆗 🆘 🈲 🉑 🈸 ⛔ 🚫 📵 ✳️ ✴️ ❇️ 🔟 🔠 🔡 🔢 🔣 🔤 🅰️ 🆎 🅱️ 🆑 🆒 🆓 ℹ️ 🆔 🆕 🆖 🅾️ 🆗 🅿️ 🆘 🆙 🆚 🈁 🈂️ 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲 💌 💘 💝 💖 💗 💓 💞 💕 💟 ❣️ 💔 🤍 💯 💢 💥 💬 💤 ➰ ➿ 🔅 📴 ➡️ 🔃 🔄 🔙 🔚 🔛 🔝 🔀 🔁 🔂',
  },
  { label: 'Flags', items: '🏁 🚩 🏴 🏳️ 🏳️‍🌈‍' },
]

export default {
  fonts,
  colors,
  lineHeights,
  symbols,
  emojis,
}
