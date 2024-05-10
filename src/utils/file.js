const fileTypes = {
  ai: ['ai', 'eps'],
  app: ['app'],
  axure: ['rp'],
  // prettier-ignore
  book: ['mobi', 'oeb', 'lit', 'xeb', 'ebx', 'rb', 'pdb', 'epub', 'azw3', 'hlp', 'chm', 'wdl', 'ceb', 'abm', 'pdg', 'caj'],
  css: ['css', 'less', 'sass'],
  dmg: ['dmg'],
  excel: [
    'csv',
    'fods',
    'ods',
    'ots',
    'xls',
    'xlsm',
    'xlsx',
    'xlt',
    'xltm',
    'xltx',
    'et',
    'ett',
  ],
  exe: ['exe'],
  html: ['htm', 'html', 'mht'],
  // prettier-ignore
  img: ['png', 'bmp', 'jpg', 'jpeg', 'gif', 'webp', 'tga', 'exif', 'fpx', 'svg', 'hdri', 'raw', 'ico', 'jfif', 'dib', 'pbm', 'pgm', 'ppm', 'rgb'],
  java: ['jar', 'java'],
  js: ['js', 'jsx', 'ts', 'tsx'],
  json: ['json'],
  keynote: ['key'],
  md: ['md', 'markdown'],
  // prettier-ignore
  music: ['au', 'aif', 'aiff', 'aifc', 'rmi', 'mp3', 'mid', 'cda', 'wav', 'wma', 'ra', 'ram', 'snd', 'mida', 'ogg', 'ape', 'flac', 'aac'],
  numbers: ['numbers'],
  pages: ['pages'],
  pdf: ['pdf'],
  php: ['php'],
  pkg: ['pkg'],
  // prettier-ignore
  ppt: ['fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'dps', 'dpt', 'wpp'],
  psd: ['psd'],
  python: ['python'],
  sh: ['sh'],
  sketch: ['sketch'],
  sql: ['sql'],
  text: ['text', 'txt'],
  video: ['mp4', 'avi', 'mov', 'rmvb', 'rm', 'flv', 'mpeg', 'wmv', 'mkv'],
  vue: ['vue'],
  // prettier-ignore
  word: ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'odt', 'ott', 'rtf', 'wps', 'wpt'],
  xmind: ['xmind'],
  // prettier-ignore
  zip: ['zip', 'rar', 'tar', 'gz', 'gzip', 'uue', 'bz2', 'iso', '7z', 'z', 'ace', 'lzh', 'arj', 'cab'],
  font: ['eot', 'otf', 'fon', 'font', 'ttf', 'ttc', 'woff', 'woff2'],
}

export const getFileExtname = (filename) => {
  const splitFileName = filename.split('.')
  const extname = splitFileName[splitFileName.length - 1]
  return extname
}

export const getFileIcon = (filename) => {
  const extname = getFileExtname(filename)
  for (const type of Object.keys(fileTypes)) {
    if (fileTypes[type].includes(extname)) {
      return type
    }
  }
  return 'common'
}
