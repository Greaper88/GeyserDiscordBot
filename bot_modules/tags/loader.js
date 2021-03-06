const path = require('path')
const fs = require('fs')

// Relative to the project root
const tagFolder = './tags'

/**
 * Load the tags from file and return them
 */
exports.load = () => {
  const tags = {}
  const aliases = {}

  // Read tags from files
  fs.readdirSync(tagFolder).forEach(file => {
    const filePath = path.join(tagFolder, file)

    // Check 1 subfolder deep for tag files
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach(subFile => {
        const subFilePath = path.join(filePath, subFile)

        if (fs.lstatSync(subFilePath).isFile()) {
          checkForTag(subFilePath, subFile, tags, aliases)
        }
      })
    } else {
      checkForTag(filePath, file, tags, aliases)
    }
  })

  return { tags: tags, aliases: aliases }
}

/**
 * Check if a given file is a tag and load it if so
 *
 * @param {String} filePath The path of the tag file
 * @param {String} file Name of the tag file
 * @param {Object} tags List of all tags
 */
function checkForTag (filePath, file, tags, aliases) {
  if (!file.endsWith('.tag')) {
    return
  }

  const { tagName, tag } = buildTagFromFile(filePath, file)

  tags[tagName] = tag

  tag.aliases.forEach(alias => {
    if (alias in aliases) {
      console.error(`Duplicate alias registed for '${alias}' on both '${tagName}' and '${aliases[alias]}'`)
    } else {
      aliases[alias] = tagName
    }
  })
}

/**
 * Build a tag from the given file
 *
 * @param {String} filePath The path of the tag file
 * @param {String} fileName Name of the tag file
 */
function buildTagFromFile (filePath, fileName) {
  // Read the tag contents
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' })

  // Get the name and set the base tag
  const tagName = fileName.substr(0, fileName.length - 4).toLowerCase()
  const tag = {
    type: 'text',
    aliases: [],
    image: '',
    content: ''
  }

  // Loop each line
  let hitSeperator = false
  content.split('\n').forEach(line => {
    line = line.trim()

    // Have we hit the contents yet and if so just append
    if (hitSeperator) {
      tag.content += line + '\n'
      return
    }

    // Check for the seperator
    if (line === '---') {
      hitSeperator = true
    } else if (line.length !== 0 && !line.startsWith('#')) {
      // Parse the tag options
      const lineParts = line.split(':')
      switch (lineParts[0]) {
        case 'type':
          tag.type = lineParts[1].trim().toLowerCase()
          break

        case 'target':
          break

        case 'image':
          tag.image = lineParts.slice(1).join(':').trim()
          break

        case 'aliases':
          lineParts[1].split(',').forEach(alias => {
            tag.aliases.push(alias.trim())
          })
          tag.aliases.sort()
          break

        default:
          console.error(`Invalid tag option '${lineParts[0]}' for tag '${tagName}'`)
          break
      }
    }
  })

  tag.content = tag.content.trim()

  return { tagName: tagName, tag: tag }
}
