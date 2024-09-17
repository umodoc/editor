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
    t('welcome', { version: pkg.version, homepage: pkg.homepage }),
    'background:#015beb;color:#fff;border-top-left-radius:2px;border-bottom-left-radius:2px;padding:4px 8px;',
    'border-top-right-radius:2px;border-bottom-right-radius:2px;border:solid 1px #015beb;padding:3px 8px;color:#015beb',
  )
}
