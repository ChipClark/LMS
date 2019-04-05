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
      console.log(tagsArr);
      if (!items || !tagsArr) {
          return items;
      }
     return items.filter(item => tagsArr.some(c => c === item.tags));
    }
  
  }
  

  @Pipe({
    name: 'tags'
})

export class TagPipe implements PipeTransform {

    transform(items: any[], tag: string): any {

        if (!items || !tag) {
            return items;
        }

        var filtertags: any[];

        for (let i = 0; i < items.length; i++) {
            console.log(items[i].tags);
            for (let j = 0; j < items[i].tags.length; i++) {
                if (tag == items[i].tags[j]) {
                    console.log(items[i]);
                    return items[i];
                }
            }
            
        }
        
        console.log("end of transform");
        console.log(filtertags);
        return filtertags;

    }

}

