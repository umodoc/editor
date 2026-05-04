import '@/assets/styles/plyr.less'

import { loadResource } from '@/utils/load-resource'

const i18n = {
  restart: 'Restart',
  rewind: 'Rewind {seektime}s',
  play: 'Play',
  pause: 'Pause',
  fastForward: 'Forward {seektime}s',
  seek: 'Seek',
  seekLabel: '{currentTime} of {duration}',
  played: 'Played',
  buffered: 'Buffered',
  currentTime: 'Current time',
  duration: 'Duration',
  volume: 'Volume',
  mute: 'Mute',
  unmute: 'Unmute',
  enableCaptions: 'Enable captions',
  disableCaptions: 'Disable captions',
  download: 'Download',
  enterFullscreen: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  frameTitle: 'Player for {title}',
  captions: 'Captions',
  settings: 'Settings',
  pip: 'PIP',
  menuBack: 'Go back to previous menu',
  speed: 'Speed',
  normal: 'Normal',
  quality: 'Quality',
  loop: 'Loop',
  start: 'Start',
  end: 'End',
  all: 'All',
  reset: 'Reset',
  disabled: 'Disabled',
  enabled: 'Enabled',
}

export const player = async (container, cdnUrl) => {
  await loadResource(`${cdnUrl}/libs/plyr/plyr.css`, 'css', 'plyr-style')
  await loadResource(`${cdnUrl}/libs/plyr/plyr.min.js`, 'script', 'plyr-script')
  return new Plyr(container, {
    i18n,
    settings: [],
    tooltips: { controls: true },
    storage: { key: 'umo-editor:player' },
    disableContextMenu: false,
  })
}
