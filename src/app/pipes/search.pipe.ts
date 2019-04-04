import { Pipe, PipeTransform } from '@angular/core';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(items: any[], search: string): any {
        if (!items || !search) {
            return items;
        }
        const regExp = new RegExp(search, 'gi');
        const check = p => {
            return regExp.test(p.title) ||
                regExp.test(p.description) ||
                regExp.test(p.sidebar) ;
        };
        return items.filter(check);

    }

}

@Pipe({
    name: 'tags'
})

export class TagPipe implements PipeTransform {

    transform(items: any[], tags: string): any {
        if (!items || !tags) {
            return items;
        }
        console.log(items[0].tags);
        return items.filter(item => item.tags === tags);

    }

}

@Pipe({
    name: 'tagsArray',
    pure: false
  })
  export class TagsArrayPipe implements PipeTransform {
  
    transform(items: any[], tagsArr: any[]): any {
      console.log(tagsArr);
      if (!items || !tagsArr) {
          return items;
      }
     return items.filter(item => tagsArr.some(c => c === item.tags));
    }
  
  }
  
