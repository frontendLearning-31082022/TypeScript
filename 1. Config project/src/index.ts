import { Book } from './book.js'
import { books } from './book-collection.js'
import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderCurrentUser } from './user.js'
import { renderToast } from './lib.js'


function findSuitableBook(genre: string, pagesLimit: number, multipleRecommendations = true): Book | Book[] | undefined {
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
if (recommendedBook === undefined) {
    console.log('no_reconended book');
} else if (recommendedBook instanceof Book) {
    console.log(recommendedBook.name)
} else if (Array.isArray(recommendedBook)) {
    if (recommendedBook.length > 0 && recommendedBook[0] != undefined) console.log(recommendedBook[0].name);
}

window.addEventListener('DOMContentLoaded', () => {
    renderCurrentUser()
    renderSearchFormBlock()
    renderSearchStubBlock()
    renderToast(
        { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
        { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
    )
})

