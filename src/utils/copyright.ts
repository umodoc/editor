import pkg from '../../package.json'

export default `/**
 * ${pkg.name} ${pkg.version}
 * @license ${pkg.license}
 * @author ${pkg.author.name} ${pkg.author.url}
 * @see ${pkg.homepage}
 **/
`

export const consoleCopyright = () => {
  console.info(
    t('welcome'),
    'background:#015beb;color:#fff;border-top-left-radius:2px;border-bottom-left-radius:2px;padding:3px 5px;',
    'border-top-right-radius:2px;border-bottom-right-radius:2px;border:solid 1px #015beb;padding:2px 5px;color:#015beb',
    '',
  )
}
