import { Book } from './book.js'
import { books } from './book-collection.js'
import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import { renderToast } from './lib.js'


function findSuitableBook (genre: string, pagesLimit: number, multipleRecommendations = true): Book | Book[] {
  const findAlgorithm = (book: Book) => {
    return book.genre === genre && book.pagesAmount <= pagesLimit
  }

  if (multipleRecommendations) {
    return books.filter(findAlgorithm)
  } else {
    return books.find(findAlgorithm)
  }
}

const recommendedBook = findSuitableBook('fantasy', 1000)

if (recommendedBook instanceof Book) {
  console.log(recommendedBook.name)
} else {
  console.log(recommendedBook[0].name)
}

window.addEventListener('DOMContentLoaded', () => {
    renderUserBlock("Ирина","/img/avatar.png",0)
    renderSearchFormBlock()
    renderSearchStubBlock()
    renderToast(
        { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
        { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
    )
})

