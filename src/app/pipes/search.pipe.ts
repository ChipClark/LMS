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
    name: 'tagsArray',
    pure: false
  })
  export class TagsArrayPipe implements PipeTransform {
  
    transform(items: any[], tagsArr: any[]): any {
      //console.log(tagsArr);
      if (!items || !tagsArr) {
          return items;
      }
     return items.filter(item => tagsArr.some(c => c === item.tags));
    }
  
  }
  

@Pipe({
    name: 'tags',
    pure: false
})

export class TagPipe implements PipeTransform {

    transform(items: any[], tag: string): any {

        if (!items || !tag) {
            return items;
        }

        var filtertags: any[] = [];

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].tags.length; j++) {
                if (tag == items[i].tags[j]) {
                    filtertags.push(items[i]);
                }
            }
        }
        return filtertags;
    }

}

