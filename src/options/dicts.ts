export const defaultDicts = {
  fonts: [
    {
      label: { en_US: 'Default Font', zh_CN: '默认字体', ru_RU: 'default' },
      value: null,
    },
    {
      label: { en_US: 'Songti', zh_CN: '宋体', ru_RU: 'Songti' },
      value: 'SimSun',
    },
    {
      label: { en_US: 'Heiti', zh_CN: '黑体', ru_RU: 'Heiti' },
      value: 'SimHei',
    },
    {
      label: { en_US: 'Kaiti', zh_CN: '楷体', ru_RU: 'Kaiti' },
      value: 'KaiTi',
    },
    {
      label: {
        en_US: 'Kaiti GB2312',
        zh_CN: '楷体_GB2312',
        ru_RU: 'Kaiti GB2312',
      },
      value: 'KaiTi_GB2312',
    },
    {
      label: { en_US: 'Fangsong', zh_CN: '仿宋', ru_RU: 'Fangsong' },
      value: 'FangSong',
    },
    {
      label: {
        en_US: 'Fangsong GB2312',
        zh_CN: '仿宋_GB2312',
        ru_RU: 'Fangsong GB2312',
      },
      value: 'FangSong_GB2312',
    },
    {
      label: { en_US: 'STSong', zh_CN: '华文宋体', ru_RU: 'STSong' },
      value: 'STSong',
    },
    {
      label: { en_US: 'STFangsong', zh_CN: '华文仿宋', ru_RU: 'STFangsong' },
      value: 'STFangsong',
    },
    {
      label: {
        en_US: 'FZ Fangsong Simplified',
        zh_CN: '方正仿宋简体',
        ru_RU: 'FZ Fangsong Simplified',
      },
      value: 'FZFangSong-Z02S',
    },
    {
      label: {
        en_US: 'FZ Xiaobiao Song',
        zh_CN: '方正小标宋',
        ru_RU: 'FZ Xiaobiao Song',
      },
      value: 'FZXiaoBiaoSong-B05S',
    },
    {
      label: {
        en_US: 'Microsoft Yahei',
        zh_CN: '微软雅黑',
        ru_RU: 'Microsoft Yahei',
      },
      value: 'Microsoft Yahei',
    },
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
      "#FFF",
      "#000",
      "#4A5366",
      "#3B74EC",
      "#45A2EF",
      "#529867",
      "#CD4A3F",
      "#EA8D40",
      "#EEC543",
      "#8E45D0",
      "#F2F2F2",
      "#7F7F7F",
      "#F4F5F7",
      "#CBDCFC",
      "#E8F6FE",
      "#EDFAF2",
      "#FCEAE9",
      "#FDF3EC",
      "#FEF9E5",
      "#FAECFE",
      "#EEE",
      "#595959",
      "#C6CAD2",
      "#CEEBFD",
      "#CBDCFC",
      "#CBE9D7",
      "#F7CBC9",
      "#FADDC7",
      "#FDEEB5",
      "#EBCAFC",
      "#BFBFBF",
      "#3F3F3F",
      "#828B9D",
      "#A0BEFA",
      "#A7DCFC",
      "#A6D5B8",
      "#F2A19C",
      "#F5BC8C",
      "#FBE281",
      "#CB94F9",
      "#A5A5A5",
      "#262626",
      "#363B44",
      "#2452B2",
      "#3473A1",
      "#417A53",
      "#922B22",
      "#AD642A",
      "#9E8329",
      "#57297D",
      "#939393",
      "#0D0D0D",
      "#25272E",
      "#15316A",
      "#1C415A",
      "#284D34",
      "#511712",
      "#573213",
      "#635217",
      "#36194E",
    ],
  lineHeights: [
    {
      label: { en_US: 'Single', zh_CN: '单倍行距', ru_RU: 'Одинарный' },
      value: 1,
    },
    {
      label: {
        en_US: '1.5 Line Spacing',
        zh_CN: '1.5 倍行距',
        ru_RU: '1.5 Межстрочных интервала',
      },
      value: 1.5,
      default: true,
    },
    {
      label: { en_US: 'Double', zh_CN: '2 倍行距', ru_RU: 'Двойной' },
      value: 2,
    },
    {
      label: {
        en_US: '2.5 Line Spacing',
        zh_CN: '2.5 倍行距',
        ru_RU: '2.5 Межстрочных интервала',
      },
      value: 2.5,
    },
    {
      label: { en_US: 'Triple', zh_CN: '3 倍行距', ru_RU: 'Тройной' },
      value: 3,
    },
  ],
  symbols: [
    {
      label: {
        en_US: 'Plain Text',
        zh_CN: '普通文本',
        ru_RU: 'Простой Текст',
      },
      items: '‹›«»‘’“”‚„¡¿‥…‡‰‱‼⁈⁉⁇©®™§¶⁋',
    },
    {
      label: {
        en_US: 'Currency Symbols',
        zh_CN: '货币符号',
        ru_RU: 'Символы Валют',
      },
      items: '$€¥£¢₠₡₢₣₤¤₿₥₦₧₨₩₪₫₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽',
    },
    {
      label: {
        en_US: 'Mathematical Symbols',
        zh_CN: '数学符号',
        ru_RU: 'Математические Символы',
      },
      items: '<>≤≥–—¯‾°−±÷⁄×ƒ∫∑∞√∼≅≈≠≡∈∉∋∏∧∨¬∩∪∂∀∃∅∇∗∝∠¼½¾',
    },
    {
      label: { en_US: 'Arrows', zh_CN: '箭头', ru_RU: 'Стрелки' },
      items: '←→↑↓⇐⇒⇑⇓⇠⇢⇡⇣⇤⇥⤒⤓↨',
    },
    {
      label: {
        en_US: 'Latin Script',
        zh_CN: '拉丁语',
        ru_RU: 'Латинская письменность',
      },
      items:
        'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ',
    },
  ],
  emojis: [
    {
      label: {
        en_US: 'Emotions & People',
        zh_CN: '表情与角色',
        ru_RU: 'Эмоции & Люди',
      },
      items:
        '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😙 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😶‍ 😏 😒 🙄 😬 😮‍ 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 😵‍💫 🤯 🤠 🥳 😎 🤓 🧐 😕 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 👿 💀 ☠️ 💩 🤡 👹 👺 👻 👽 👾 🤖 👋 🤚 🖐️ ✋ 🖖 👌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻',
    },
    {
      label: {
        en_US: 'Animals & Nature',
        zh_CN: '动物与自然',
        ru_RU: 'Животные & Природа',
      },
      items:
        '🐵 🐒 🦍 🦧 🐶 🐕 🦮 🐕‍🦺 🐩 🐺 🦊 🦝 🐱 🐈 🐈‍⬛ 🦁 🐯 🐅 🐆 🐴 🐎 🦄 🦓 🦌 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦙 🦒 🐘 🦏 🦛 🐭 🐁 🐀 🐹 🐰 🐇 🐿️ 🦔 🦇 🐻 🐻‍❄️ 🐨 🐼 🦥 🦦 🦨 🦘 🦡 🐾 🦃 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🕊️ 🦅 🦆 🦢 🦉 🦩 🦚 🦜 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🦭 🐟 🐠 🐡 🦈 🐙 🐚 🐌 🦋 🐛 🐜 🐝 🐞 🦗 🕷️ 🕸️ 🦂 🦟 🦠 💐 🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 ☀️ 🌝 🌞 🪐 🌟 🌠 🌌 ☁️ ⛅ ⛈️ 🌤️ 🌥️ 🌦️ 🌧️ 🌨️ 🌩️ 🌪️ 🌫️ 🌬️ 🌀 🌈 🌂 ☂️ ☔ ⛱️ ⚡ ❄️ ☃️ ⛄ ☄️ 🔥 💧 🌊',
    },
    {
      label: {
        en_US: 'Food & Drink',
        zh_CN: '食物与食品',
        ru_RU: 'Еда & Напитки',
      },
      items:
        '🍇 🍉 🍊 🍋 🍌 🍍 🥭 🍎 🍏 🍐 🍑 🍒 🍓 🥝 🍅 🥥 🥑 🍆 🥔 🥕 🌽 🌶️ 🥬 🥦 🧄 🧅 🍄 🥜 🌰 🍞 🥐 🥖 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🧆 🥚 🍳 🥘 🍲 🥣 🥗 🍿 🧈 🧂 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🥮 🍡 🥟 🥠 🥡 🦀 🦞 🦐 🦑 🦪 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🥤 🧃 🧉 🧊 🥢 🍽️ 🍴 🥄 🔪 🏺',
    },
    {
      label: { en_US: 'Activities', zh_CN: '活动', ru_RU: 'Активность' },
      items:
        '🧧 🎁 🎄 🧨 ✨ 🎈 🎉 🏮 🎗️ 🎟️ 🎫 🎖️ 🏆 🏅 🥇 🥈 🥉 ⚽ ⚾ 🥎 🏀 🏐 🏈 🏉 🎾 🥏 🎳 🏏 🏑 🏒 🥍 🏓 🏸 🥊 🥋 🥅 ⛳ ⛸️ 🎣 🤿 🎽 🎿 🛷 🥌 🎯 🪀 🪁 🎱 🔮 🧿 🎮 🕹️ 🎰 🎲 🧩 🧸 ♟️ 🃏 🀄 🎴 🎭 🖼️ 🎨 🧵 🧶',
    },
    {
      label: {
        en_US: 'Travel & Places',
        zh_CN: '旅行与景点',
        ru_RU: 'Путешествия & Места',
      },
      items:
        '🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🚚 🚛 🚜 🏎️ 🏍️ 🛵 🦽 🦼 🛺 🚲 🛴 🛹 🚏 🛣️ 🛤️ 🛢️ ⛽ 🚨 🚥 🚦 🛑 🚧 ⚓ ⛵ 🛶 🚤 🛳️ ⛴️ 🛥️ 🚢 ✈️ 🛩️ 🛫 🛬 🪂 💺 🚁 🚟 🚠 🚡 🛰️ 🚀 🛸 🛎️ 🧳 🧭 ⌚ ⏰ ⏱️ ⏲️ 🕰️ 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦',
    },
    {
      label: { en_US: 'Objects', zh_CN: '物品', ru_RU: 'Объекты' },
      items:
        '📔 📕 📖 📗 📘 📙 📚 📒 📃 📜 📄 📰 🗞️ 📑 🔖 🏷️ 💰 🔍 🔎 💴 💵 💶 💷 💸 💳 🧾 💹 ✉️ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 🗳️ ✏️ ✒️ 🖋️ 🖊️ 🖌️ 🖍️ 📝 💼 📁 📂 🗂️ 📅 📆 🗒️ 🗓️ 📇 📈 📉 📊 📋 📌 📍 📎 🖇️ 📏 📐 ✂️ 🗃️ 🗄️ 🗑️ 🔒 🔓 🔏 🔐 🔑 🗝️ 🔨 🪓 ⛏️ ⚒️ 🛠️ 🗡️ ⚔️ 🔫 🏹 🛡️ 🔧 🔩 ⚙️ 🗜️ ⚖️ 🦯 🔗 ⛓️ 🧰 🧲 ⚗️ 🧪 🧫 🧬 🔬 🔭 📡 💉 🩸 💊 🩹 🩺 🚪 🛏️ 🛋️ 🪑 🚽 🚿 🛁 🪒 🧴 🧷 🧹 🧺 🧻 🧼 🧽 🧯 🛒 🚬 ⚰️ ⚱️ 💎 🔇 🔈 🔉 🔊 🔔 🔕 🔋 🔌 💻 🖥️ 🖨️ ⌨️ 🖱️ 🖲️ 📷 🧱',
    },
    {
      label: { en_US: 'Symbols', zh_CN: '符号', ru_RU: 'Символы' },
      items:
        '💡 ✅ ☑️ ✔️ ❌ ❎ ❓ ❗ ❔ ❕ ⌛ ⏳ 💰 🆒 🆕 🆖 🅾️ 🆗 🆘 🈲 🉑 🈸 ⛔ 🚫 📵 ✳️ ✴️ ❇️ 🔟 🔠 🔡 🔢 🔣 🔤 🅰️ 🆎 🅱️ 🆑 🆒 🆓 ℹ️ 🆔 🆕 🆖 🅾️ 🆗 🅿️ 🆘 🆙 🆚 🈁 🈂️ 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲 💌 💘 💝 💖 💗 💓 💞 💕 💟 ❣️ 💔 🤍 💯 💢 💥 💬 💤 ➰ ➿ 🔅 📴 ➡️ 🔃 🔄 🔙 🔚 🔛 🔝 🔀 🔁 🔂',
    },
    {
      label: { en_US: 'Flags', zh_CN: '旗帜', ru_RU: 'Флаги' },
      items: '🏁 🚩 🏴 🏳️ 🏳️‍🌈‍',
    },
  ],
  pageSizes: [
    { label: 'A4', width: 21.0, height: 29.7, default: true },
    { label: 'A3', width: 29.7, height: 42.0 },
    { label: 'A5', width: 14.8, height: 21.0 },
    { label: 'B5', width: 17.6, height: 25.0 },
    {
      label: {
        en_US: 'No. 5 Envelope',
        zh_CN: '5号信封',
        ru_RU: 'Конверт №5',
      },
      width: 10.9,
      height: 12.9,
    },
    {
      label: {
        en_US: 'No. 6 Envelope',
        zh_CN: '6号信封',
        ru_RU: 'Конверт №6',
      },
      width: 11.9,
      height: 22.9,
    },
    {
      label: {
        en_US: 'No. 7 Envelope',
        zh_CN: '7号信封',
        ru_RU: 'Конверт №7',
      },
      width: 16.1,
      height: 22.8,
    },
    {
      label: {
        en_US: 'No. 9 Envelope',
        zh_CN: '9号信封',
        ru_RU: 'Конверт №9',
      },
      width: 22.8,
      height: 32.3,
    },
    {
      label: {
        en_US: 'Legal Paper',
        zh_CN: '法律用纸',
        ru_RU: 'Юридическая бумага',
      },
      width: 21.5,
      height: 33.5,
    },
    {
      label: {
        en_US: 'Letter Paper',
        zh_CN: '信纸',
        ru_RU: 'Бумага для писем',
      },
      width: 21.5,
      height: 27.9,
    },
  ],
}
