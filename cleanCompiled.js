import {
  readdir as getDirectoryListing,
  rm as removeDirectory,
} from 'fs/promises'

const compiledDirectory = (
  './out'
)

getDirectoryListing(
  '.'
)
.then((
  directories
) => (
  (
    directories
    .includes(
      compiledDirectory
    )
  )
  ? (
    removeDirectory(
      compiledDirectory,
      {
        recursive: true
      },
    )
  )
  : (
    Promise
    .resolve()
  )
))
.catch((
  error,
) => {
  console
  .error(
    error
  )
})
