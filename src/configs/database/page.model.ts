export class Page {
    skip?: number
    take?: number
  }
  
  export class PageResponse<T> {
    items: T[]
    total: number
  }