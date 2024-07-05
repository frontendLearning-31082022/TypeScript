export class Book {
  name: string
  genre: string
  pagesAmount: number

  constructor (name: string, genre: string, pagesAmount: number) {
    this.name = name
    this.genre = genre
    this.pagesAmount = pagesAmount
  }
}
