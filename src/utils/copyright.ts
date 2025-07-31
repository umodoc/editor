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
    'background:#3480f9;color:#fff;border-top-left-radius:3px;border-bottom-left-radius:3px;padding:4px 8px 3px;',
    'background:#fff;color:#3480f9;border-top-right-radius:3px;border-bottom-right-radius:3px;border:solid 1px #3480f9;padding:3px 8px 2px;',
  )
}

export const { version } = pkg
