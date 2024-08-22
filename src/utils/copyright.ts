import pkg from '../../package.json'

export default `/**
 * ${pkg.name} ${pkg.version}
 * @license ${pkg.license}
 * @author ${pkg.author.name} ${pkg.author.url}
 * @see ${pkg.homepage}
 **/
`
